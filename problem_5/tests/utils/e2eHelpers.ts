/**
 * E2E test helper utilities
 * Provides helpers for making authenticated requests and asserting responses
 */

import request from 'supertest';
import { Application } from 'express';

/**
 * Create authentication headers for testing
 * Uses simple x-user-id and x-user-role header authentication
 */
export const createAuthHeaders = (
  userId: number,
  role: string = 'SELLER',
): Record<string, string> => {
  return {
    'x-user-id': userId.toString(),
    'x-user-role': role,
  };
};

/**
 * Create an authenticated supertest request
 */
export const makeAuthRequest = (
  app: Application,
  userId: number,
  role: string = 'SELLER',
) => {
  return request(app).set(createAuthHeaders(userId, role));
};

/**
 * Assert successful response with expected structure
 */
export const expectSuccessResponse = (
  response: request.Response,
  expectedStatus: number = 200,
) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('message');
  expect(response.body).toHaveProperty('data');
};

/**
 * Assert that response is an error response
 */
export const expectErrorResponse = (
  response: request.Response,
  expectedStatus: number,
  expectedMessage?: string,
) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('error');

  if (expectedMessage) {
    expect(response.body.error.message).toContain(expectedMessage);
  }
};

/**
 * Assert validation error response
 */
export const expectValidationError = (
  response: request.Response,
  field?: string,
) => {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('success', false);

  if (field) {
    expect(response.body.message).toContain(field);
  }
};

/**
 * Assert that response is unauthorized (401)
 */
export const expectUnauthorized = (response: request.Response) => {
  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('success', false);
};

/**
 * Assert that response is not found (404)
 */
export const expectNotFound = (response: request.Response) => {
  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('success', false);
};

/**
 * Wait for a specified duration (for async operations)
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
