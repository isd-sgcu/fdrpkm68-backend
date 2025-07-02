import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { RoleType } from '../types/enum';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      student_id: string;
      citizen_id: string;
      role: RoleType;
    };
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ status: 'error', message: 'No token provided or invalid format' });
    return
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.SECRET_JWT_KEY as string) as {
      student_id: string;
      citizen_id: string;
      role: RoleType;
    };
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ status: 'error', message: 'Token expired' });
      return
    }
    res.status(401).json({ status: 'error', message: 'Failed to authenticate token' });
    return
  }
};

// Role-based access control middleware
export const roleMiddleware = (allowedRoles: Array<RoleType>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ status: 'error', message: 'Access forbidden: Insufficient permissions' });
      return
    }
    next();
  };
};