-- CreateEnum
CREATE TYPE "prefix_type" AS ENUM ('MR', 'MS', 'OTHER');

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
    "id" UUID NOT NULL,
    "student_id" TEXT NOT NULL,
    "citizen_id" TEXT NOT NULL,
    "prefix" "prefix_type" NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "faculty" TEXT NOT NULL,
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
    "role" "role_type" NOT NULL DEFAULT 'FRESHMAN',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkin" (
    "id" UUID NOT NULL,
    "user_student_id" TEXT NOT NULL,
    "event" "event_type" NOT NULL,
    "status" "checkin_status_type" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "houses" (
    "id" UUID NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description_th" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "size_letter" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "instagram" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "tiktok" TEXT NOT NULL,

    CONSTRAINT "houses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "invite_code" TEXT NOT NULL,
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "house_rank_1" UUID,
    "house_rank_2" UUID,
    "house_rank_3" UUID,
    "house_rank_4" UUID,
    "house_rank_5" UUID,
    "house_rank_sub" UUID,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_student_id_key" ON "users"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_student_id_citizen_id_key" ON "users"("student_id", "citizen_id");

-- CreateIndex
CREATE UNIQUE INDEX "checkin_user_student_id_event_key" ON "checkin"("user_student_id", "event");

-- CreateIndex
CREATE UNIQUE INDEX "groups_owner_id_key" ON "groups"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_invite_code_key" ON "groups"("invite_code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_user_student_id_fkey" FOREIGN KEY ("user_student_id") REFERENCES "users"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "groups" ADD CONSTRAINT "groups_house_rank_sub_fkey" FOREIGN KEY ("house_rank_sub") REFERENCES "houses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
