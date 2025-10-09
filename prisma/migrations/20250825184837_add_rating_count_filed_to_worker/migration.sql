/*
  Warnings:

  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "fullName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Worker" ADD COLUMN     "nationalIdUrl" TEXT,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;
