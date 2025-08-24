/*
  Warnings:

  - The values [GUESTHOUSEADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('ADMIN', 'WORKER', 'COMPANY', 'OWNER', 'BROKER');
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."UserRole_new" USING ("role"::text::"public"."UserRole_new");
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "public"."Worker" ADD COLUMN     "category" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "professionalRole" TEXT,
ADD COLUMN     "workType" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");
