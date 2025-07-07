/*
  Warnings:

  - You are about to drop the column `house_rank_6` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `size_letter_id` on the `houses` table. All the data in the column will be lost.
  - You are about to drop the `house_sizes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `size_letter` to the `houses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_house_rank_6_fkey";

-- DropForeignKey
ALTER TABLE "houses" DROP CONSTRAINT "houses_size_letter_id_fkey";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "house_rank_6",
ADD COLUMN     "house_rank_sub" UUID;

-- AlterTable
ALTER TABLE "houses" DROP COLUMN "size_letter_id",
ADD COLUMN     "size_letter" TEXT NOT NULL;

-- DropTable
DROP TABLE "house_sizes";

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_sub_fkey" FOREIGN KEY ("house_rank_sub") REFERENCES "houses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
