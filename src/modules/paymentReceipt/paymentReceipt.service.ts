// src/modules/paymentReceipt/paymentReceipt.service.ts
import  prisma  from "../../config/prisma";
import { Prisma } from "@prisma/client";

export type CreateReceiptDto = {
  bankId: string;
  planId?: string;
  amount: number;
  referenceNo?: string;
  screenshot: string;
};

export const createReceipt = async (userId: string, dto: CreateReceiptDto) => {
  return prisma.paymentReceipt.create({
    data: {
      userId,
      bankId: dto.bankId,
      planId: dto.planId,
      amount: dto.amount,
      referenceNo: dto.referenceNo,
      screenshot: dto.screenshot,
      status: "PENDING",
    },
  });
};

export const getReceiptsByUser = async (userId: string, take = 50, skip = 0) => {
  return prisma.paymentReceipt.findMany({
    where: { userId },
    take,
    skip,
    orderBy: { createdAt: "desc" },
    include: { bank: true, plan: true, transaction: true },
  });
};

export const getReceiptById = async (id: string) => {
  return prisma.paymentReceipt.findUnique({
    where: { id },
    include: { bank: true, plan: true, user: { include: { wallet: true } }, transaction: true },
  });
};

export const adminListReceipts = async (filters: { status?: string; take?: number; skip?: number } = {}) => {
  const where: Prisma.PaymentReceiptWhereInput = {};
  if (filters.status) where.status = filters.status as any;
  return prisma.paymentReceipt.findMany({
    where,
    take: filters.take ?? 50,
    skip: filters.skip ?? 0,
    orderBy: { createdAt: "desc" },
    include: { user: true, bank: true, plan: true, transaction: true },
  });
};

export const adminGetReceipt = getReceiptById;

/**
 * Approve receipt:
 * - ensures receipt is PENDING
 * - creates Transaction
 * - increments/creates user's Wallet
 * - updates the PaymentReceipt linking to the Transaction and setting status APPROVED and verifiedBy
 * - creates Subscription if receipt.planId exists
 *
 * All in an atomic transaction.
 */
export const adminApproveReceipt = async (receiptId: string, adminUserId: string) => {
  // fetch receipt with user & plan info
  const receipt = await prisma.paymentReceipt.findUnique({
    where: { id: receiptId },
    include: { user: { include: { wallet: true } }, plan: true },
  });
  if (!receipt) throw new Error("Receipt not found");
  if (receipt.status !== "PENDING") throw new Error("Receipt already processed");

  // Ensure wallet exists (create if missing)
  let wallet = receipt.user.wallet;
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        userId: receipt.userId,
        balance: 0,
        currency: "ETB",
      },
    });
  }

  const amount = receipt.amount;

  // Optionally validate amount against plan price
  if (receipt.plan && typeof receipt.plan.price === "number") {
    // here price is likely stored in cents (Int). Adjust as necessary.
    if (amount < receipt.plan.price) {
      throw new Error("Paid amount is less than plan price");
    }
  }

  // Run DB transaction:
  return prisma.$transaction(async (tx) => {
    // 1. create transaction record
    const createdTx = await tx.transaction.create({
      data: {
        walletId: wallet.id,
        type: "SUBSCRIPTION", 
        amount,
      },
    });

    // 2. increment wallet balance
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amount },
      },
    });

    // 3. update receipt to APPROVED and connect transaction + verifiedBy
    const updatedReceipt = await tx.paymentReceipt.update({
      where: { id: receiptId },
      data: {
        status: "APPROVED",
        transaction: { connect: { id: createdTx.id } },
        verifiedBy: { connect: { id: adminUserId } },
      },
      include: { transaction: true, user: true, plan: true },
    });

    // 4. create subscription if plan exists
    let subscription = null;
    if (receipt.planId) {
      // decide endDate based on plan interval (assumes Plan has `interval`)
      const plan = await tx.plan.findUnique({ where: { id: receipt.planId } });
      const now = new Date();
      const end = new Date(now);
      if (plan?.interval === "MONTHLY") end.setMonth(end.getMonth() + 1);
      else if (plan?.interval === "YEARLY") end.setFullYear(end.getFullYear() + 1);
      else end.setMonth(end.getMonth() + 1); // fallback

      subscription = await tx.subscription.create({
        data: {
          userId: receipt.userId,
          planId: receipt.planId,
          status: "ACTIVE",
          startDate: now,
          endDate: end,
          autoRenew: false,
        },
      });
    }

    return { transaction: createdTx, receipt: updatedReceipt, subscription };
  });
};

export const adminRejectReceipt = async (receiptId: string, adminUserId: string, reason?: string) => {
  const receipt = await prisma.paymentReceipt.findUnique({ where: { id: receiptId } });
  if (!receipt) throw new Error("Receipt not found");
  if (receipt.status !== "PENDING") throw new Error("Receipt already processed");
  // Update status to REJECTED and optionally set a reason if you included such a field in the schema
  // If you don't have a rejectionReason column, just update status & verifiedBy
  return prisma.paymentReceipt.update({
    where: { id: receiptId },
    data: {
      status: "REJECTED",
      verifiedById: adminUserId,
      // rejectionReason: reason, // uncomment if model has this field
    },
  });
};
