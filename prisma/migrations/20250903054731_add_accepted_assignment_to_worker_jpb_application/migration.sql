-- AlterEnum
ALTER TYPE "public"."NotificationType" ADD VALUE 'JOB_ASSIGNED';

-- AlterTable
ALTER TABLE "public"."WorkerJobApplication" ADD COLUMN     "acceptedAssignment" BOOLEAN NOT NULL DEFAULT false;
