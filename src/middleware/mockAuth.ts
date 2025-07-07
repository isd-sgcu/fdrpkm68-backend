import { Request, Response, NextFunction } from "express";
import { prisma } from "@/lib/prisma";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    studentId: string;
  };
}
export const mockAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const studentId = req.headers['x-student-id'] as string;

    if (!userId && !studentId) {
      res.status(401).json({
        success: false,
        error: "Authentication required. Provide x-user-id or x-student-id header.",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, studentId: true },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          error: "Invalid user ID",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      req.user = {
        id: user.id,
        studentId: user.studentId,
      };
    }
    else if (studentId) {
      const user = await prisma.user.findFirst({
        where: { studentId },
        select: { id: true, studentId: true },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          error: "Invalid student ID",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      req.user = {
        id: user.id,
        studentId: user.studentId,
      };
    }

    next();
  } catch (error) {
    console.error("Mock auth middleware error:", error);
    res.status(500).json({
      success: false,
      error: "Authentication service error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const studentId = req.headers['x-student-id'] as string;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, studentId: true },
      });

      if (user) {
        req.user = {
          id: user.id,
          studentId: user.studentId,
        };
      }
    } else if (studentId) {
      const user = await prisma.user.findFirst({
        where: { studentId },
        select: { id: true, studentId: true },
      });

      if (user) {
        req.user = {
          id: user.id,
          studentId: user.studentId,
        };
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};

export const requireUserId = (req: AuthenticatedRequest): string => {
  if (!req.user?.id) {
    throw new Error("User not authenticated");
  }
  return req.user.id;
};

export const requireStudentId = (req: AuthenticatedRequest): string => {
  if (!req.user?.studentId) {
    throw new Error("User not authenticated");
  }
  return req.user.studentId;
};