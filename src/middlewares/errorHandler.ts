import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  data?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode;
  const message = err.message;

  console.error(`Error ${statusCode}: ${message}`, err.stack);

  res.status(statusCode as number).json({
    status: 'error',
    message: message,
    data: err.data, 
  });
};