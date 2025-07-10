/*
  Warnings:

  - A unique constraint covering the columns `[user_id,event,status]` on the table `checkin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "workshop_type" AS ENUM ('DIFFUSER', 'KEYCHAIN');

-- CreateEnum
CREATE TYPE "bottle_choice" AS ENUM ('NONE', 'A', 'B', 'C');

-- AlterEnum
ALTER TYPE "prefix_type" ADD VALUE 'MRS';

-- DropIndex
DROP INDEX "checkin_user_id_event_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bottle_choice" "bottle_choice" NOT NULL DEFAULT 'NONE',
ALTER COLUMN "prefix" SET DEFAULT 'OTHER';

-- CreateTable
CREATE TABLE "StaffData" (
    "id" UUID NOT NULL,
    "student_id" TEXT NOT NULL,
    "citizen_id" TEXT NOT NULL,

    CONSTRAINT "StaffData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rpkm_workshops" (
    "id" UUID NOT NULL,
    "workshop_type" "workshop_type" NOT NULL,
    "user_id" UUID NOT NULL,
    "workshop_time" INTEGER NOT NULL,

    CONSTRAINT "rpkm_workshops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StaffData_student_id_idx" ON "StaffData"("student_id");

-- CreateIndex
CREATE INDEX "StaffData_citizen_id_idx" ON "StaffData"("citizen_id");

-- CreateIndex
CREATE UNIQUE INDEX "StaffData_student_id_citizen_id_key" ON "StaffData"("student_id", "citizen_id");

-- CreateIndex
CREATE INDEX "rpkm_workshops_workshop_time_idx" ON "rpkm_workshops"("workshop_time");

-- CreateIndex
CREATE UNIQUE INDEX "rpkm_workshops_workshop_type_user_id_key" ON "rpkm_workshops"("workshop_type", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "checkin_user_id_event_status_key" ON "checkin"("user_id", "event", "status");
