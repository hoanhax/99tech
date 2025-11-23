/**
 * Test database utilities for E2E tests
 * Handles database setup, teardown, and reset operations
 */

import { prisma, disconnectDatabase } from '../../src/config/database';
import { execSync } from 'child_process';

/**
 * Get Prisma client for testing
 */
export const getTestPrismaClient = () => {
  return prisma;
};

/**
 * Build database URL from environment variables
 */
function getDatabaseUrl(): string {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
  return `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public`;
}

/**
 * Setup test database - run migrations
 */
export const setupTestDatabase = async (): Promise<void> => {
  try {
    // Set DATABASE_URL for migrations
    const databaseUrl = getDatabaseUrl();

    // Run migrations on test database
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'pipe',
    });

    // Connect to database
    await prisma.$connect();
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
};

/**
 * Reset test database - clear all data
 */
export const resetTestDatabase = async (): Promise<void> => {
  const client = getTestPrismaClient();

  try {
    // Delete all data in reverse order of dependencies
    await client.product.deleteMany({});
    await client.user.deleteMany({});
  } catch (error) {
    console.error('Failed to reset test database:', error);
    throw error;
  }
};

/**
 * Seed test data - create initial test users and products
 */
export const seedTestData = async (): Promise<{
  users: any[];
  products: any[];
}> => {
  const client = getTestPrismaClient();

  try {
    // Create test users
    const user1 = await client.user.create({
      data: {
        id: 1,
        email: 'test1@example.com',
        name: 'Test User 1',
        password: 'hashed_password_1',
      },
    });

    const user2 = await client.user.create({
      data: {
        id: 2,
        email: 'test2@example.com',
        name: 'Test User 2',
        password: 'hashed_password_2',
      },
    });

    // Create test products
    const product1 = await client.product.create({
      data: {
        name: 'Test Product 1',
        description: 'Description for product 1',
        price: 99.99,
        category: 'Electronics',
        stock: 100,
        status: 'ACTIVE',
        ownerId: 1,
      },
    });

    const product2 = await client.product.create({
      data: {
        name: 'Test Product 2',
        description: 'Description for product 2',
        price: 149.99,
        category: 'Books',
        stock: 50,
        status: 'ACTIVE',
        ownerId: 1,
      },
    });

    const product3 = await client.product.create({
      data: {
        name: 'Test Product 3',
        description: 'Description for product 3',
        price: 199.99,
        category: 'Electronics',
        stock: 25,
        status: 'INACTIVE',
        ownerId: 2,
      },
    });

    return {
      users: [user1, user2],
      products: [product1, product2, product3],
    };
  } catch (error) {
    console.error('Failed to seed test data:', error);
    throw error;
  }
};

/**
 * Teardown test database - disconnect
 */
export const teardownTestDatabase = async (): Promise<void> => {
  await disconnectDatabase();
};

/**
 * Clean test database - reset and seed
 */
export const cleanTestDatabase = async (): Promise<void> => {
  await resetTestDatabase();
  await seedTestData();
};
