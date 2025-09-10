-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "User_status_verification_idx" ON "public"."User"("status", "verification");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "public"."User"("createdAt");

-- CreateIndex
CREATE INDEX "Worker_categoryId_idx" ON "public"."Worker"("categoryId");

-- CreateIndex
CREATE INDEX "Worker_roleId_idx" ON "public"."Worker"("roleId");

-- CreateIndex
CREATE INDEX worker_skills_gin_idx ON "Worker" USING GIN ("skills");