import { PrefixType } from "@prisma/client";

export interface LoginRequest {
  studentId: string;
  citizenId: string;
  password: string;
}

export interface RegisterRequest {
  studentId: string;
  citizenId: string;
  prefix: PrefixType;
  firstName: string;
  lastName: string;
  nickname: string;
  academicYear: number;
  faculty: string;
  password: string;
  phoneNumber: string;
  parentName: string;
  parentPhoneNumber: string;
  parentRelationship: string;
  foodAllergy?: string;
  drugAllergy?: string;
  illness?: string;
}

export interface ForgotPasswordRequest {
  studentId: string;
  citizenId: string;
  newPassword: string;
}
