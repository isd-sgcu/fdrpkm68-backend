import type { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    studentId: string;
    citizenId: string;
  };
}
