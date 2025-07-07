import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const EXPIRES_IN = "48h";

export function signJwt(user: Pick<User, "studentId" | "citizenId">): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyJwt(token: string): {
  studentId: string;
  citizenId: string;
} {
  return jwt.verify(token, JWT_SECRET) as {
    studentId: string;
    citizenId: string;
  };
}
