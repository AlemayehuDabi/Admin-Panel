/*
  Warnings:

  - You are about to drop the column `category` on the `Worker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Worker" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "roleId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Worker" ADD CONSTRAINT "Worker_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Worker" ADD CONSTRAINT "Worker_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
