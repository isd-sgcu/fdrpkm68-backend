/*
  Warnings:

  - The primary key for the `checkin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `submitted` on the `groups` table. All the data in the column will be lost.
  - The `house_rank_1` column on the `groups` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `house_rank_2` column on the `groups` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `house_rank_3` column on the `groups` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `house_rank_4` column on the `groups` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `house_rank_5` column on the `groups` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `house_rank_6` column on the `groups` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `house_sizes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `houses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `max_member` on the `houses` table. All the data in the column will be lost.
  - You are about to drop the column `member_count` on the `houses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,citizen_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `checkin` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `house_sizes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `capacity` to the `houses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facebook` to the `houses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiktok` to the `houses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `houses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `size_letter_id` on the `houses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_house_rank_1_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_house_rank_2_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_house_rank_3_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_house_rank_4_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_house_rank_5_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_house_rank_6_fkey";

-- DropForeignKey
ALTER TABLE "houses" DROP CONSTRAINT "houses_size_letter_id_fkey";

-- AlterTable
ALTER TABLE "checkin" DROP CONSTRAINT "checkin_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "checkin_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "submitted",
ADD COLUMN     "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "member_count" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "house_rank_1",
ADD COLUMN     "house_rank_1" UUID,
DROP COLUMN "house_rank_2",
ADD COLUMN     "house_rank_2" UUID,
DROP COLUMN "house_rank_3",
ADD COLUMN     "house_rank_3" UUID,
DROP COLUMN "house_rank_4",
ADD COLUMN     "house_rank_4" UUID,
DROP COLUMN "house_rank_5",
ADD COLUMN     "house_rank_5" UUID,
DROP COLUMN "house_rank_6",
ADD COLUMN     "house_rank_6" UUID;

-- AlterTable
ALTER TABLE "house_sizes" DROP CONSTRAINT "house_sizes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "house_sizes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "houses" DROP CONSTRAINT "houses_pkey",
DROP COLUMN "max_member",
DROP COLUMN "member_count",
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "facebook" TEXT NOT NULL,
ADD COLUMN     "tiktok" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "size_letter_id",
ADD COLUMN     "size_letter_id" UUID NOT NULL,
ADD CONSTRAINT "houses_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_student_id_citizen_id_key" ON "users"("student_id", "citizen_id");

-- AddForeignKey
ALTER TABLE "houses" ADD CONSTRAINT "houses_size_letter_id_fkey" FOREIGN KEY ("size_letter_id") REFERENCES "house_sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_1_fkey" FOREIGN KEY ("house_rank_1") REFERENCES "houses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_2_fkey" FOREIGN KEY ("house_rank_2") REFERENCES "houses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_3_fkey" FOREIGN KEY ("house_rank_3") REFERENCES "houses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_4_fkey" FOREIGN KEY ("house_rank_4") REFERENCES "houses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_5_fkey" FOREIGN KEY ("house_rank_5") REFERENCES "houses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_6_fkey" FOREIGN KEY ("house_rank_6") REFERENCES "houses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
