/*
  Warnings:

  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."ChapaStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "phone" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."ChapaTransaction" (
    "id" TEXT NOT NULL,
    "txRef" TEXT NOT NULL,
    "chapaRef" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "status" "public"."ChapaStatus" NOT NULL DEFAULT 'PENDING',
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "meta" JSONB,
    "userId" TEXT,
    "walletId" TEXT,
    "transactionId" TEXT,
    "paymentReceiptId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapaTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChapaTransaction_txRef_key" ON "public"."ChapaTransaction"("txRef");

-- CreateIndex
CREATE INDEX "ChapaTransaction_userId_idx" ON "public"."ChapaTransaction"("userId");

-- CreateIndex
CREATE INDEX "ChapaTransaction_walletId_idx" ON "public"."ChapaTransaction"("walletId");

-- CreateIndex
CREATE INDEX "ChapaTransaction_status_idx" ON "public"."ChapaTransaction"("status");

-- CreateIndex
CREATE INDEX "ChapaTransaction_createdAt_idx" ON "public"."ChapaTransaction"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."ChapaTransaction" ADD CONSTRAINT "ChapaTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChapaTransaction" ADD CONSTRAINT "ChapaTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "public"."Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChapaTransaction" ADD CONSTRAINT "ChapaTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChapaTransaction" ADD CONSTRAINT "ChapaTransaction_paymentReceiptId_fkey" FOREIGN KEY ("paymentReceiptId") REFERENCES "public"."PaymentReceipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
