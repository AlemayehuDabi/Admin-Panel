import prisma from "../../config/prisma";
import { TransactionType } from "@prisma/client";

// Get all wallets with optional filters
export const getAllWallets = async () => {
  return prisma.wallet.findMany({
    include: {
      user: true,
      transactions: true,
    },
  });
};

// Get wallet by user ID
export const getWalletByUserId = async (userId: string) => {
  return prisma.wallet.findUnique({
    where: { userId },
    include: {
      user: true,
      transactions: true,
    },
  });
};

// Adjust wallet balance manually (admin)
export const adjustWalletBalance = async (
  userId: string,
  amount: number,
  type: TransactionType,
) => {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error("Wallet not found");

  const updatedBalance = wallet.balance + amount;

  const transaction = await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      amount,
      type,
    },
  });

  const updatedWallet = await prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: updatedBalance },
    include: { transactions: true },
  });

  return updatedWallet;
};

// Get transaction history (optionally filter by type)
export const getTransactions = async (walletId: string, type?: TransactionType) => {
  return prisma.transaction.findMany({
    where: {
      walletId,
      type: type || undefined,
    },
    orderBy: { createdAt: "desc" },
  });
};
