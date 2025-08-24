/*
  Warnings:

  - You are about to drop the column `location` on the `Worker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "public"."Worker" DROP COLUMN "location";
