import { FacultyId, PrefixType, RoleType } from "@prisma/client";
import type { UUID } from "crypto";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  };
  timestamp: string;
}

export interface RegisterRequest {
  studentId: string;
  citizenId: string;
  prefix: PrefixType;
  firstName: string;
  lastName: string;
  nickname: string;
  academicYear: number;
  faculty: FacultyId;
  password: string;
  phoneNumber: string;
  parentName: string;
  parentPhoneNumber: string;
  parentRelationship: string;
  foodAllergy?: string;
  drugAllergy?: string;
  illness?: string;
  role: RoleType;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface StudentLoginCredentials {
  studentId: string;
  password: string;
}

export interface AuthToken {
  token: string;
  expiresAt: string;
  userId: string;
}
