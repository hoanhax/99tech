/**
 * Product test data fixtures
 */

import { Product, Prisma } from '@prisma/client';
import { ProductCreateData, ProductUpdateInput } from '../../src/components/products/types';

/**
 * Create a mock product with default values
 */
export const createMockProduct = (overrides: Partial<Product> = {}): Product => {
  return {
    id: 1,
    name: 'Test Product',
    description: 'Test product description',
    price: new Prisma.Decimal(99.99),
    category: 'Electronics',
    stock: 100,
    status: 'ACTIVE',
    ownerId: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
    ...overrides,
  };
};

/**
 * Create multiple mock products
 */
export const createMockProducts = (count: number = 3): Product[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockProduct({
      id: i + 1,
      name: `Test Product ${i + 1}`,
      price: new Prisma.Decimal((i + 1) * 10),
    }),
  );
};

/**
 * Valid product creation data
 */
export const validProductCreateData: ProductCreateData = {
  name: 'New Product',
  description: 'A new test product',
  price: 49.99,
  category: 'Books',
  status: 'ACTIVE',
  ownerId: 1,
};

/**
 * Invalid product creation data (missing required fields)
 */
export const invalidProductCreateData = {
  description: 'Missing name and price',
  category: 'Books',
};

/**
 * Valid product update data
 */
export const validProductUpdateData: ProductUpdateInput = {
  name: 'Updated Product',
  description: 'Updated description',
  price: 79.99,
  category: 'Electronics',
  status: 'ACTIVE',
};

/**
 * Invalid product update data (invalid price)
 */
export const invalidProductUpdateData = {
  price: -10, // Negative price
};
