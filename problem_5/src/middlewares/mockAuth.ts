import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { authConfig } from '@config/env';
import { Logger } from '@utils/logger';

/**
 * Mock Authentication Middleware
 *
 * WARNING: This is for DEVELOPMENT/TESTING ONLY!
 * This middleware reads user credentials from HTTP headers for testing purposes.
 *
 * Headers:
 * - X-User-Id: User ID (number)
 * - X-User-Role: User role (ADMIN, USER, GUEST)
 *
 * Usage:
 * curl -H "X-User-Id: 1" -H "X-User-Role: ADMIN" http://localhost:4000/api/v1/products
 */
export const mockAuth = (req: Request, res: Response, next: NextFunction) => {
  // Only work if mock auth is explicitly enabled
  if (!authConfig.enableMockAuth) {
    return res.status(401).json({
      error: 'Unauthorized',
      message:
        'Mock authentication is disabled. Please use proper authentication.',
    });
  }

  // Log warning that mock auth is being used
  Logger.warn('⚠️  MOCK AUTHENTICATION IS ACTIVE - DEVELOPMENT ONLY');

  // Read headers
  const userIdHeader = req.headers['x-user-id'] as string;
  const userRoleHeader = req.headers['x-user-role'] as string;

  // Validate headers exist
  if (!userIdHeader || !userRoleHeader) {
    return res.status(400).json({
      error: 'Bad Request',
      message:
        'Missing authentication headers. Required: X-User-Id, X-User-Role',
    });
  }

  // Parse user ID
  const userId = parseInt(userIdHeader, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'X-User-Id must be a valid number',
    });
  }

  // Validate role
  const role = userRoleHeader.toUpperCase() as Role;

  // Attach mock user to request
  req.user = {
    id: userId,
    role: role,
  };

  return next();
};
