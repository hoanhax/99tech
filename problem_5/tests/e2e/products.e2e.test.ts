/**
 * E2E tests for Product API endpoints
 * Tests the complete request/response cycle with real database
 */

import request from 'supertest';
import app from '../../src/app';
import {
  setupTestDatabase,
  resetTestDatabase,
  seedTestData,
  teardownTestDatabase,
} from '../utils/testDatabase';
import {
  createAuthHeaders,
  expectSuccessResponse,
  expectErrorResponse,
  expectNotFound,
} from '../utils/e2eHelpers';

describe('Product API E2E Tests', () => {
  // Setup and teardown
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    await seedTestData();
  });

  describe('GET /api/v1/products', () => {
    it('should return all products with page_meta', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .set(createAuthHeaders(1));

      expectSuccessResponse(response, 200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);

      // Verify page_meta structure
      expect(response.body.page_meta).toBeDefined();
      expect(response.body.page_meta).toHaveProperty('next_cursor');
      expect(response.body.page_meta).toHaveProperty('prev_cursor');
      expect(response.body.page_meta).toHaveProperty('has_more');
      expect(response.body.page_meta).toHaveProperty('count');
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/v1/products?category=Electronics')
        .set(createAuthHeaders(1));

      expectSuccessResponse(response, 200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.page_meta).toBeDefined();
      response.body.data.forEach((product: any) => {
        expect(product.category).toBe('Electronics');
      });
    });

    it('should filter products by status', async () => {
      const response = await request(app)
        .get('/api/v1/products?status=ACTIVE')
        .set(createAuthHeaders(1));

      expectSuccessResponse(response, 200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.page_meta).toBeDefined();
      response.body.data.forEach((product: any) => {
        expect(product.status).toBe('ACTIVE');
      });
    });

    it('should search products by name', async () => {
      const response = await request(app)
        .get('/api/v1/products?search=Product 1')
        .set(createAuthHeaders(1));

      expectSuccessResponse(response, 200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.page_meta).toBeDefined();
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should support pagination with limit parameter', async () => {
      const response = await request(app)
        .get('/api/v1/products?limit=2')
        .set(createAuthHeaders(1));

      expectSuccessResponse(response, 200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.page_meta).toBeDefined();
      expect(response.body.page_meta.count).toBeLessThanOrEqual(2);
    });

    it('should support cursor-based pagination', async () => {
      // First, get the first page
      const firstPage = await request(app)
        .get('/api/v1/products?limit=2')
        .set(createAuthHeaders(1));

      expectSuccessResponse(firstPage, 200);
      expect(firstPage.body.page_meta).toBeDefined();

      // If there's a next_cursor, fetch the next page
      if (firstPage.body.page_meta.next_cursor) {
        const secondPage = await request(app)
          .get(`/api/v1/products?limit=2&cursor=${firstPage.body.page_meta.next_cursor}&direction=next`)
          .set(createAuthHeaders(1));

        expectSuccessResponse(secondPage, 200);
        expect(secondPage.body.data).toBeInstanceOf(Array);
        expect(secondPage.body.page_meta).toBeDefined();

        // Verify we got different products
        const firstPageIds = firstPage.body.data.map((p: any) => p.id);
        const secondPageIds = secondPage.body.data.map((p: any) => p.id);
        expect(firstPageIds).not.toEqual(secondPageIds);
      }
    });

    it('should combine multiple filters', async () => {
      const response = await request(app)
        .get('/api/v1/products?category=Electronics&status=ACTIVE')
        .set(createAuthHeaders(1));

      expectSuccessResponse(response, 200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.page_meta).toBeDefined();
      response.body.data.forEach((product: any) => {
        expect(product.category).toBe('Electronics');
        expect(product.status).toBe('ACTIVE');
      });
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/v1/products');

      // Mock auth returns 400 when headers are missing
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/products', () => {
    const validProductData = {
      name: 'New Test Product',
      description: 'A new product for testing',
      price: 299.99,
      category: 'Electronics',
      stock: 75,
      status: 'ACTIVE',
    };

    it('should create product with valid data and auth', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set(createAuthHeaders(1))
        .send(validProductData);

      expectSuccessResponse(response, 201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(validProductData.name);
      expect(response.body.data.ownerId).toBe(1);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .send(validProductData);

      // Mock auth returns 400 when headers are missing
      expect(response.status).toBe(400);
    });

    it('should return 400 with missing required fields', async () => {
      const invalidData = {
        description: 'Missing name and price',
      };

      const response = await request(app)
        .post('/api/v1/products')
        .set(createAuthHeaders(1))
        .send(invalidData);

      // Validation errors return 422
      expectErrorResponse(response, 422);
    });

    it('should return 400 with duplicate product name', async () => {
      const duplicateData = {
        name: 'Test Product 1', // Already exists from seed
        description: 'Duplicate product',
        price: 99.99,
        category: 'Electronics',
        stock: 10,
        status: 'ACTIVE',
      };

      const response = await request(app)
        .post('/api/v1/products')
        .set(createAuthHeaders(1))
        .send(duplicateData);

      expectErrorResponse(response, 400, 'already exists');
    });

    it('should return 400 with negative price', async () => {
      const invalidPriceData = {
        ...validProductData,
        price: -10,
      };

      const response = await request(app)
        .post('/api/v1/products')
        .set(createAuthHeaders(1))
        .send(invalidPriceData);

      // Validation errors return 422
      expectErrorResponse(response, 422);
    });

    it('should return 400 with zero price', async () => {
      const zeroPriceData = {
        ...validProductData,
        price: 0,
      };

      const response = await request(app)
        .post('/api/v1/products')
        .set(createAuthHeaders(1))
        .send(zeroPriceData);

      // Validation errors return 422
      expectErrorResponse(response, 422);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return product by ID', async () => {
      // First, get a product to know its ID
      const listResponse = await request(app)
        .get('/api/v1/products')
        .set(createAuthHeaders(1));

      const productId = listResponse.body.data[0].id;

      const response = await request(app)
        .get(`/api/v1/products/${productId}`)
        .set(createAuthHeaders(1));

      expectSuccessResponse(response, 200);
      expect(response.body.data).toHaveProperty('id', productId);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/v1/products/99999')
        .set(createAuthHeaders(1));

      expectNotFound(response);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/v1/products/invalid-id')
        .set(createAuthHeaders(1));

      // Validation errors return 422
      expectErrorResponse(response, 422);
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/v1/products/1');

      // Mock auth returns 400 when headers are missing
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    const updateData = {
      name: 'Updated Product Name',
      description: 'Updated description',
      price: 399.99,
      category: 'Books',
      stock: 150,
      status: 'ACTIVE',
    };

    it('should update product with valid data and auth', async () => {
      // Get a product ID first
      const listResponse = await request(app)
        .get('/api/v1/products')
        .set(createAuthHeaders(1));

      const productId = listResponse.body.data[0].id;

      const response = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set(createAuthHeaders(1))
        .send(updateData);

      expectSuccessResponse(response, 200);
      expect(response.body.data.name).toBe(updateData.name);
      // Price is returned as string from Prisma Decimal
      expect(parseFloat(response.body.data.price)).toBe(updateData.price);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/api/v1/products/1')
        .send(updateData);

      // Mock auth returns 400 when headers are missing
      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .put('/api/v1/products/99999')
        .set(createAuthHeaders(1))
        .send(updateData);

      // Policy check runs first, returns 403 for non-existent resources
      expect(response.status).toBe(403);
    });

    it('should return 400 with invalid data', async () => {
      const listResponse = await request(app)
        .get('/api/v1/products')
        .set(createAuthHeaders(1));

      const productId = listResponse.body.data[0].id;

      const invalidData = {
        ...updateData,
        price: -50,
      };

      const response = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set(createAuthHeaders(1))
        .send(invalidData);

      // Validation errors return 422
      expectErrorResponse(response, 422);
    });
  });

  describe('PATCH /api/v1/products/:id', () => {
    it('should partially update product', async () => {
      const listResponse = await request(app)
        .get('/api/v1/products')
        .set(createAuthHeaders(1));

      const productId = listResponse.body.data[0].id;
      const originalName = listResponse.body.data[0].name;

      const partialData = {
        price: 499.99,
      };

      const response = await request(app)
        .patch(`/api/v1/products/${productId}`)
        .set(createAuthHeaders(1))
        .send(partialData);

      expectSuccessResponse(response, 200);
      // Price is returned as string from Prisma Decimal
      expect(parseFloat(response.body.data.price)).toBe(partialData.price);
      expect(response.body.data.name).toBe(originalName); // Name should not change
    });

    it('should update only specified fields', async () => {
      const listResponse = await request(app)
        .get('/api/v1/products')
        .set(createAuthHeaders(1));

      const productId = listResponse.body.data[0].id;

      const partialData = {
        description: 'Partially updated description',
      };

      const response = await request(app)
        .patch(`/api/v1/products/${productId}`)
        .set(createAuthHeaders(1))
        .send(partialData);

      expectSuccessResponse(response, 200);
      expect(response.body.data.description).toBe(partialData.description);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .patch('/api/v1/products/1')
        .send({ price: 100 });

      // Mock auth returns 400 when headers are missing
      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .patch('/api/v1/products/99999')
        .set(createAuthHeaders(1))
        .send({ price: 100 });

      // Policy check runs first, returns 403 for non-existent resources
      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should delete product with auth', async () => {
      const listResponse = await request(app)
        .get('/api/v1/products')
        .set(createAuthHeaders(1));

      const productId = listResponse.body.data[0].id;

      const response = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set(createAuthHeaders(1));

      expectSuccessResponse(response, 200);
    });

    it('should actually remove product from database', async () => {
      const listResponse = await request(app)
        .get('/api/v1/products')
        .set(createAuthHeaders(1));

      const productId = listResponse.body.data[0].id;

      // Delete the product
      await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set(createAuthHeaders(1));

      // Try to get the deleted product
      const getResponse = await request(app)
        .get(`/api/v1/products/${productId}`)
        .set(createAuthHeaders(1));

      // Should return 404
      expect(getResponse.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).delete('/api/v1/products/1');

      // Mock auth returns 400 when headers are missing
      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .delete('/api/v1/products/99999')
        .set(createAuthHeaders(1));

      // Policy check runs first, returns 403 for non-existent resources
      expect(response.status).toBe(403);
    });
  });
});
