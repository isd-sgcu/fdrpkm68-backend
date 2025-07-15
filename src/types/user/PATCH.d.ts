import { PrefixType, RoleType, BottleChoice } from "@prisma/client";

export interface UpdateRequest {
  prefix: PrefixType;
  firstName: string;
  lastName: string;
  nickname: string;
  faculty: string;
  phoneNumber: string;
  parentName: string;
  parentPhoneNumber: string;
  parentRelationship: string;
  role: RoleType;
  academicYear: number;
}

export interface UpdateBottleChoiceRequest {
  bottleChoice: BottleChoice;
}
