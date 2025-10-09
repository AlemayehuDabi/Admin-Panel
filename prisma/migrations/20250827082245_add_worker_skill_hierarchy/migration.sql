/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderId_fkey";

-- AlterTable
ALTER TABLE "public"."License" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Wallet" ALTER COLUMN "currency" SET DEFAULT 'ETB';

-- DropTable
DROP TABLE "public"."Message";

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Speciality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialityId" TEXT NOT NULL,

    CONSTRAINT "WorkType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkerSpeciality" (
    "workerId" TEXT NOT NULL,
    "specialityId" TEXT NOT NULL,

    CONSTRAINT "WorkerSpeciality_pkey" PRIMARY KEY ("workerId","specialityId")
);

-- CreateTable
CREATE TABLE "public"."WorkerWorkType" (
    "workerId" TEXT NOT NULL,
    "workTypeId" TEXT NOT NULL,

    CONSTRAINT "WorkerWorkType_pkey" PRIMARY KEY ("workerId","workTypeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- AddForeignKey
ALTER TABLE "public"."Role" ADD CONSTRAINT "Role_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Speciality" ADD CONSTRAINT "Speciality_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkType" ADD CONSTRAINT "WorkType_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "public"."Speciality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkerSpeciality" ADD CONSTRAINT "WorkerSpeciality_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkerSpeciality" ADD CONSTRAINT "WorkerSpeciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "public"."Speciality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkerWorkType" ADD CONSTRAINT "WorkerWorkType_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkerWorkType" ADD CONSTRAINT "WorkerWorkType_workTypeId_fkey" FOREIGN KEY ("workTypeId") REFERENCES "public"."WorkType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
