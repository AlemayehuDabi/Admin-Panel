-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "User_referredBy_idx" ON "public"."User"("referredBy");
