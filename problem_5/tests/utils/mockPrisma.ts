/**
 * Prisma mocking utilities for unit tests
 * Provides type-safe mock helpers for Prisma client operations
 */

export const createMockPrismaModel = () => {
  return {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  };
};

/**
 * Create a mock Prisma client with all models
 */
export const createMockPrismaClient = () => {
  return {
    product: createMockPrismaModel(),
    user: createMockPrismaModel(),
    $disconnect: jest.fn(),
    $connect: jest.fn(),
  };
};

/**
 * Reset all mocks in a Prisma model
 */
export const resetMockPrismaModel = (model: ReturnType<typeof createMockPrismaModel>) => {
  Object.values(model).forEach((fn) => {
    if (jest.isMockFunction(fn)) {
      fn.mockReset();
    }
  });
};
