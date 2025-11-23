// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/HTTPError';
import { Logger } from '@utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  Logger.error(err.message);
  if (err instanceof HTTPError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(err.errors && { errors: err.errors }),
      },
    });
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      success: false,
      error: { message: 'Database operation failed' },
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    error: {
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Internal server error',
    },
  });
};
