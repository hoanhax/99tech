/**
 * Common test utilities and helpers
 */

import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../src/types/common';

/**
 * Create a mock Express Request object
 */
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  };
};

/**
 * Create a mock Express Response object
 */
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res;
};

/**
 * Create a mock authenticated request with user
 */
export const createMockAuthRequest = (
  userId: number = 1,
  overrides: Partial<AuthenticatedRequest> = {},
): Partial<AuthenticatedRequest> => {
  return {
    ...createMockRequest(overrides),
    user: {
      id: userId,
      email: `user${userId}@example.com`,
      name: `Test User ${userId}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ...overrides,
  } as Partial<AuthenticatedRequest>;
};

/**
 * Mock next function for middleware testing
 */
export const createMockNext = () => jest.fn();
