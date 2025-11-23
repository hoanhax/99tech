import { Request, Response, NextFunction } from 'express';
import { authConfig } from '../config/env';
import { mockAuth } from './mockAuth';

/**
 * Authentication Middleware
 *
 * This middleware handles authentication for the application.
 * - In development with ENABLE_MOCK_AUTH=true: Uses mock authentication via headers
 * - In production: Will use JWT authentication (to be implemented)
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if mock authentication is enabled
  if (authConfig.enableMockAuth) {
    // Use mock authentication for testing
    return mockAuth(req, res, next);
  }

  // TODO: Implement JWT authentication here
  // For now, return 401 if mock auth is not enabled and JWT is not implemented
  return res.status(401).json({
    error: 'Unauthorized',
    message:
      'Authentication is required. JWT authentication not yet implemented.',
  });
};
