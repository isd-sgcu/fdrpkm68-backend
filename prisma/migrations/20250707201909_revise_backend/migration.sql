-- CreateIndex
CREATE INDEX "groups_invite_code_idx" ON "groups"("invite_code");

-- CreateIndex
CREATE INDEX "groups_is_confirmed_idx" ON "groups"("is_confirmed");

-- CreateIndex
CREATE INDEX "groups_member_count_idx" ON "groups"("member_count");

-- CreateIndex
CREATE INDEX "groups_owner_id_idx" ON "groups"("owner_id");

-- CreateIndex
CREATE INDEX "houses_chosen_count_idx" ON "houses"("chosen_count");

-- CreateIndex
CREATE INDEX "houses_capacity_idx" ON "houses"("capacity");

-- CreateIndex
CREATE INDEX "users_group_id_idx" ON "users"("group_id");

-- CreateIndex
CREATE INDEX "users_student_id_idx" ON "users"("student_id");
