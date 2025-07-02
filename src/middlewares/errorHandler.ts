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
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // console.error(`Error ${statusCode}: ${message}`, err.stack);

  res.status(statusCode).json({
    status: 'error',
    message: message,
    data: err.data, 
  });
};