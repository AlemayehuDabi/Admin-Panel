/*
  Warnings:

  - The `acceptedAssignment` column on the `WorkerJobApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."WorkerJobApplication" DROP COLUMN "acceptedAssignment",
ADD COLUMN     "acceptedAssignment" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING';
