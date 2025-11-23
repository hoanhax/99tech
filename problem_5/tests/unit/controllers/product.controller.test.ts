/**
 * Unit tests for ProductController
 * Tests request/response handling with mocked service
 */

import { ProductController } from '@components/products/controller';
import { ProductService } from '@components/products/service';
import { ProductsRepository } from '@components/products/repository';
import { HttpStatus } from '@config/enums';
import {
  createMockRequest,
  createMockResponse,
  createMockAuthRequest,
  createMockNext,
} from '../../utils/testHelpers';
import {
  createMockProduct,
  createMockProducts,
  validProductCreateData,
} from '../../fixtures/products';

// Mock the repository
jest.mock('@components/products/repository');
jest.mock('@config/database', () => ({
  prisma: {
    product: {},
  },
}));

describe('ProductController', () => {
  let controller: ProductController;
  let mockService: jest.Mocked<ProductService>;
  let mockRepository: jest.Mocked<ProductsRepository>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRepository = new ProductsRepository() as jest.Mocked<ProductsRepository>;
    mockService = new ProductService(mockRepository) as jest.Mocked<ProductService>;
    controller = new ProductController(mockService);
    mockNext = createMockNext();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return list of products', async () => {
      // Arrange
      const mockProducts = createMockProducts(3);
      const mockPaginatedResponse = {
        data: mockProducts,
        page_meta: {
          next_cursor: null,
          prev_cursor: null,
          has_more: false,
          count: 3,
        },
      };
      const req = createMockRequest({ query: {} });
      const res = createMockResponse();
      mockService.list = jest.fn().mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.list(req as any, res as any, mockNext);

      // Assert
      expect(mockService.list).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Products found successfully',
        data: mockProducts,
        page_meta: mockPaginatedResponse.page_meta,
      });
    });

    it('should pass filters to service', async () => {
      // Arrange
      const mockProducts = createMockProducts(1);
      const mockPaginatedResponse = {
        data: mockProducts,
        page_meta: {
          next_cursor: null,
          prev_cursor: null,
          has_more: false,
          count: 1,
        },
      };
      const filters = { category: 'Electronics', status: 'ACTIVE' };
      const req = createMockRequest({ query: filters });
      const res = createMockResponse();
      mockService.list = jest.fn().mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.list(req as any, res as any, mockNext);

      // Assert
      expect(mockService.list).toHaveBeenCalledWith(filters);
    });
  });

  describe('create', () => {
    it('should create a product with authenticated user', async () => {
      // Arrange
      const mockProduct = createMockProduct();
      const req = createMockAuthRequest(1, { body: validProductCreateData });
      const res = createMockResponse();
      mockService.create = jest.fn().mockResolvedValue(mockProduct);

      // Act
      await controller.create(req as any, res as any, mockNext);

      // Assert
      expect(mockService.create).toHaveBeenCalledWith({
        ...validProductCreateData,
        ownerId: 1,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product created successfully',
        data: mockProduct,
      });
    });

    it('should use correct owner id from authenticated user', async () => {
      // Arrange
      const mockProduct = createMockProduct({ ownerId: 42 });
      const req = createMockAuthRequest(42, { body: validProductCreateData });
      const res = createMockResponse();
      mockService.create = jest.fn().mockResolvedValue(mockProduct);

      // Act
      await controller.create(req as any, res as any, mockNext);

      // Assert
      expect(mockService.create).toHaveBeenCalledWith({
        ...validProductCreateData,
        ownerId: 42,
      });
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      // Arrange
      const mockProduct = createMockProduct({ id: 1 });
      const req = createMockRequest({ params: { id: '1' } });
      const res = createMockResponse();
      mockService.findById = jest.fn().mockResolvedValue(mockProduct);

      // Act
      await controller.findById(req as any, res as any, mockNext);

      // Assert
      expect(mockService.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product found successfully',
        data: mockProduct,
      });
    });

    it('should convert string id to number', async () => {
      // Arrange
      const mockProduct = createMockProduct({ id: 123 });
      const req = createMockRequest({ params: { id: '123' } });
      const res = createMockResponse();
      mockService.findById = jest.fn().mockResolvedValue(mockProduct);

      // Act
      await controller.findById(req as any, res as any, mockNext);

      // Assert
      expect(mockService.findById).toHaveBeenCalledWith(123);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      // Arrange
      const updateData = { name: 'Updated Product', price: 79.99 };
      const mockProduct = createMockProduct({ id: 1, name: 'Updated Product' });
      const req = createMockRequest({
        params: { id: '1' },
        body: updateData,
      });
      const res = createMockResponse();
      mockService.update = jest.fn().mockResolvedValue(mockProduct);

      // Act
      await controller.update(req as any, res as any, mockNext);

      // Assert
      expect(mockService.update).toHaveBeenCalledWith(1, updateData);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product updated successfully',
        data: mockProduct,
      });
    });
  });

  describe('partialUpdate', () => {
    it('should partially update a product', async () => {
      // Arrange
      const partialData = { name: 'Updated Name' };
      const mockProduct = createMockProduct({ id: 1, name: 'Updated Name' });
      const req = createMockRequest({
        params: { id: '1' },
        body: partialData,
      });
      const res = createMockResponse();
      mockService.update = jest.fn().mockResolvedValue(mockProduct);

      // Act
      await controller.partialUpdate(req as any, res as any, mockNext);

      // Assert
      expect(mockService.update).toHaveBeenCalledWith(1, partialData);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product updated successfully',
        data: mockProduct,
      });
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      // Arrange
      const mockProduct = createMockProduct({ id: 1 });
      const req = createMockAuthRequest(1, { params: { id: '1' } });
      const res = createMockResponse();
      mockService.delete = jest.fn().mockResolvedValue(mockProduct);

      // Act
      await controller.delete(req as any, res as any, mockNext);

      // Assert
      expect(mockService.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product deleted successfully',
        data: mockProduct,
      });
    });
  });
});
