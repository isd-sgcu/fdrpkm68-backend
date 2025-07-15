import type { Request } from "express";

export interface AuthUser {
  id: string;
  studentId: string;
  citizenId: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
