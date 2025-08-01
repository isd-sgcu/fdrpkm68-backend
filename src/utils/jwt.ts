import { RoleType, User } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const EXPIRES_IN = "48h";

export function signJwt(
  user: Pick<User, "id" | "studentId" | "citizenId" | "role">
): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyJwt(token: string): {
  id: string;
  studentId: string;
  citizenId: string;
  role: RoleType;
} {
  return jwt.verify(token, JWT_SECRET) as {
    id: string;
    studentId: string;
    citizenId: string;
    role: RoleType;
  };
}
