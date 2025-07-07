-- CreateEnum
CREATE TYPE "prefix_type" AS ENUM ('MR', 'MS', 'OTHER');

-- CreateEnum
CREATE TYPE "faculty_id" AS ENUM ('SCIENCE', 'ENGINEER', 'MEDICINE', 'ARTS', 'EDUCATION', 'PSYCHOLOGY', 'DENTISTRY', 'LAW', 'COMMUNICATION_ARTS', 'NURSING', 'COMMERCE_AND_ACCOUNTANCY', 'PHARMACEUTICAL_SCIENCE', 'POLITICAL_SCIENCE', 'SPORTS_SCIENCE', 'FINE_AND_APPLIED_ARTS', 'ECONOMICS', 'ARCHITECTURE', 'ALLIED_HEALTH_SCIENCES', 'VETERINARY_SCIENCE');

-- CreateEnum
CREATE TYPE "role_type" AS ENUM ('STAFF', 'FRESHMAN');

-- CreateEnum
CREATE TYPE "event_type" AS ENUM ('FIRSTDATE', 'RPKM', 'FRESHMENNIGHT');

-- CreateEnum
CREATE TYPE "checkin_status_type" AS ENUM ('PRE_REGISTER', 'EVENT_REGISTER');

-- CreateEnum
CREATE TYPE "housesize_letter_type" AS ENUM ('S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "group_role_type" AS ENUM ('OWNER', 'MEMBER');

-- CreateTable
CREATE TABLE "users" (
    "student_id" VARCHAR(10) NOT NULL,
    "citizen_id" VARCHAR(13) NOT NULL,
    "prefix" "prefix_type" NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "faculty" "faculty_id" NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "parent_name" TEXT NOT NULL,
    "parent_phone_number" TEXT NOT NULL,
    "parent_relationship" TEXT NOT NULL,
    "food_allergy" TEXT,
    "drug_allergy" TEXT,
    "illness" TEXT,
    "avatar_id" SMALLINT NOT NULL DEFAULT 1,
    "group_id" UUID,
    "group_role" "group_role_type" NOT NULL DEFAULT 'OWNER',
    "role" "role_type" NOT NULL DEFAULT 'FRESHMAN',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "checkin" (
    "id" SERIAL NOT NULL,
    "user_student_id" VARCHAR(10) NOT NULL,
    "event" "event_type" NOT NULL,
    "status" "checkin_status_type" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "house_sizes" (
    "size_letter" "housesize_letter_type" NOT NULL,
    "max_member" INTEGER NOT NULL,

    CONSTRAINT "house_sizes_pkey" PRIMARY KEY ("size_letter")
);

-- CreateTable
CREATE TABLE "houses" (
    "house_id" SERIAL NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "description_th" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "size_letter" "housesize_letter_type" NOT NULL,
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "max_member" INTEGER NOT NULL,
    "instagram" TEXT NOT NULL,

    CONSTRAINT "houses_pkey" PRIMARY KEY ("house_id")
);

-- CreateTable
CREATE TABLE "groups" (
    "group_id" UUID NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "house_rank_1" INTEGER,
    "house_rank_2" INTEGER,
    "house_rank_3" INTEGER,
    "house_rank_4" INTEGER,
    "house_rank_5" INTEGER,
    "house_rank_6" INTEGER,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("group_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checkin_user_student_id_event_key" ON "checkin"("user_student_id", "event");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_user_student_id_fkey" FOREIGN KEY ("user_student_id") REFERENCES "users"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "houses" ADD CONSTRAINT "houses_size_letter_fkey" FOREIGN KEY ("size_letter") REFERENCES "house_sizes"("size_letter") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_1_fkey" FOREIGN KEY ("house_rank_1") REFERENCES "houses"("house_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_2_fkey" FOREIGN KEY ("house_rank_2") REFERENCES "houses"("house_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_3_fkey" FOREIGN KEY ("house_rank_3") REFERENCES "houses"("house_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_4_fkey" FOREIGN KEY ("house_rank_4") REFERENCES "houses"("house_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_5_fkey" FOREIGN KEY ("house_rank_5") REFERENCES "houses"("house_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_6_fkey" FOREIGN KEY ("house_rank_6") REFERENCES "houses"("house_id") ON DELETE SET NULL ON UPDATE CASCADE;
