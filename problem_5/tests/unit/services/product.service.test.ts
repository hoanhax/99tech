/**
 * Unit tests for ProductService
 * Tests business logic with mocked repository
 */

import { ProductService } from '@components/products/service';
import { ProductsRepository } from '@components/products/repository';
import { BadRequestError, NotFoundError } from '@/errors';
import {
  createMockProduct,
  createMockProducts,
  validProductCreateData,
  validProductUpdateData,
} from '../../fixtures/products';

// Mock the repository
jest.mock('@components/products/repository');
jest.mock('@config/database', () => ({
  prisma: {
    product: {},
  },
}));

describe('ProductService', () => {
  let service: ProductService;
  let mockRepository: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    // Create a new instance before each test
    mockRepository = new ProductsRepository() as jest.Mocked<ProductsRepository>;
    service = new ProductService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      // Arrange
      const mockProduct = createMockProduct({ name: 'New Product' });
      mockRepository.findFirst.mockResolvedValue(null); // No existing product
      mockRepository.create.mockResolvedValue(mockProduct);

      // Act
      const result = await service.create(validProductCreateData);

      // Assert
      expect(mockRepository.findFirst).toHaveBeenCalledWith({ name: validProductCreateData.name });
      expect(mockRepository.create).toHaveBeenCalledWith(validProductCreateData);
      expect(result).toEqual(mockProduct);
    });

    it('should throw BadRequestError if product name already exists', async () => {
      // Arrange
      const existingProduct = createMockProduct({ name: validProductCreateData.name });
      mockRepository.findFirst.mockResolvedValue(existingProduct);

      // Act & Assert
      await expect(service.create(validProductCreateData)).rejects.toThrow(BadRequestError);
      await expect(service.create(validProductCreateData)).rejects.toThrow('Product name already exists');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a product when found', async () => {
      // Arrange
      const mockProduct = createMockProduct({ id: 1 });
      mockRepository.findById.mockResolvedValue(mockProduct);

      // Act
      const result = await service.findById(1);

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundError when product not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById(999)).rejects.toThrow(NotFoundError);
      await expect(service.findById(999)).rejects.toThrow('Product not found');
    });
  });

  describe('list', () => {
    it('should return paginated products with no filters', async () => {
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
      mockRepository.findManyWithPagination.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await service.list({});

      // Assert
      expect(mockRepository.findManyWithPagination).toHaveBeenCalledWith({
        where: {},
        orderBy: { id: 'asc' },
        cursor: undefined,
        take: undefined,
        direction: undefined,
      });
      expect(result).toEqual(mockPaginatedResponse);
      expect(result.data).toEqual(mockProducts);
      expect(result.page_meta).toBeDefined();
    });

    it('should filter products by category', async () => {
      // Arrange
      const mockProducts = createMockProducts(2);
      const mockPaginatedResponse = {
        data: mockProducts,
        page_meta: {
          next_cursor: null,
          prev_cursor: null,
          has_more: false,
          count: 2,
        },
      };
      mockRepository.findManyWithPagination.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await service.list({ category: 'Electronics' });

      // Assert
      expect(mockRepository.findManyWithPagination).toHaveBeenCalledWith({
        where: { category: 'Electronics' },
        orderBy: { id: 'asc' },
        cursor: undefined,
        take: undefined,
        direction: undefined,
      });
      expect(result.data).toEqual(mockProducts);
    });

    it('should filter products by status', async () => {
      // Arrange
      const mockProducts = createMockProducts(2);
      const mockPaginatedResponse = {
        data: mockProducts,
        page_meta: {
          next_cursor: null,
          prev_cursor: null,
          has_more: false,
          count: 2,
        },
      };
      mockRepository.findManyWithPagination.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await service.list({ status: 'ACTIVE' });

      // Assert
      expect(mockRepository.findManyWithPagination).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
        orderBy: { id: 'asc' },
        cursor: undefined,
        take: undefined,
        direction: undefined,
      });
      expect(result.data).toEqual(mockProducts);
    });

    it('should search products by name and description', async () => {
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
      mockRepository.findManyWithPagination.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await service.list({ search: 'test' });

      // Assert
      expect(mockRepository.findManyWithPagination).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        orderBy: { id: 'asc' },
        cursor: undefined,
        take: undefined,
        direction: undefined,
      });
      expect(result.data).toEqual(mockProducts);
    });

    it('should support pagination with cursor, limit, and direction', async () => {
      // Arrange
      const mockProducts = createMockProducts(2);
      const mockPaginatedResponse = {
        data: mockProducts,
        page_meta: {
          next_cursor: '7',
          prev_cursor: '5',
          has_more: true,
          count: 2,
        },
      };
      mockRepository.findManyWithPagination.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await service.list({ cursor: '5', limit: 10, direction: 'next' });

      // Assert
      expect(mockRepository.findManyWithPagination).toHaveBeenCalledWith({
        where: {},
        orderBy: { id: 'asc' },
        cursor: { id: 5 },
        take: 10,
        direction: 'next',
      });
      expect(result.data).toEqual(mockProducts);
      expect(result.page_meta.has_more).toBe(true);
      expect(result.page_meta.next_cursor).toBe('7');
    });

    it('should filter by price range', async () => {
      // Arrange
      const mockProducts = createMockProducts(2);
      const mockPaginatedResponse = {
        data: mockProducts,
        page_meta: {
          next_cursor: null,
          prev_cursor: null,
          has_more: false,
          count: 2,
        },
      };
      mockRepository.findManyWithPagination.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await service.list({ minPrice: 50, maxPrice: 200 });

      // Assert
      expect(mockRepository.findManyWithPagination).toHaveBeenCalledWith({
        where: {
          price: {
            gte: 50,
            lte: 200,
          },
        },
        orderBy: { id: 'asc' },
        cursor: undefined,
        take: undefined,
        direction: undefined,
      });
      expect(result.data).toEqual(mockProducts);
    });

    it('should combine multiple filters', async () => {
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
      mockRepository.findManyWithPagination.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await service.list({
        category: 'Electronics',
        status: 'ACTIVE',
        search: 'laptop',
        minPrice: 100,
        maxPrice: 500,
      });

      // Assert
      expect(mockRepository.findManyWithPagination).toHaveBeenCalledWith({
        where: {
          category: 'Electronics',
          status: 'ACTIVE',
          price: {
            gte: 100,
            lte: 500,
          },
          OR: [
            { name: { contains: 'laptop', mode: 'insensitive' } },
            { description: { contains: 'laptop', mode: 'insensitive' } },
          ],
        },
        orderBy: { id: 'asc' },
        cursor: undefined,
        take: undefined,
        direction: undefined,
      });
      expect(result.data).toEqual(mockProducts);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      // Arrange
      const existingProduct = createMockProduct({ id: 1 });
      const updateData = { name: 'Updated Product', price: 79.99 };
      const updatedProduct = createMockProduct({ id: 1, name: 'Updated Product' });
      mockRepository.findById.mockResolvedValue(existingProduct);
      mockRepository.update.mockResolvedValue(updatedProduct);

      // Act
      const result = await service.update(1, updateData);

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        {
          ...updateData,
          updatedAt: expect.any(Date),
        },
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundError when product not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, validProductUpdateData)).rejects.toThrow(NotFoundError);
      await expect(service.update(999, validProductUpdateData)).rejects.toThrow('Product not found');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError when price is zero', async () => {
      // Arrange
      const existingProduct = createMockProduct({ id: 1 });
      mockRepository.findById.mockResolvedValue(existingProduct);

      // Act & Assert
      await expect(service.update(1, { price: 0 })).rejects.toThrow(BadRequestError);
      await expect(service.update(1, { price: 0 })).rejects.toThrow('Price must be greater than 0');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError when price is negative', async () => {
      // Arrange
      const existingProduct = createMockProduct({ id: 1 });
      mockRepository.findById.mockResolvedValue(existingProduct);

      // Act & Assert
      await expect(service.update(1, { price: -10 })).rejects.toThrow(BadRequestError);
      await expect(service.update(1, { price: -10 })).rejects.toThrow('Price must be greater than 0');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should allow partial updates', async () => {
      // Arrange
      const existingProduct = createMockProduct({ id: 1 });
      const partialUpdate = { name: 'Updated Name' };
      const updatedProduct = createMockProduct({ id: 1, name: 'Updated Name' });
      mockRepository.findById.mockResolvedValue(existingProduct);
      mockRepository.update.mockResolvedValue(updatedProduct);

      // Act
      const result = await service.update(1, partialUpdate);

      // Assert
      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        {
          ...partialUpdate,
          updatedAt: expect.any(Date),
        },
      );
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      // Arrange
      const mockProduct = createMockProduct({ id: 1 });
      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.delete.mockResolvedValue(mockProduct);

      // Act
      const result = await service.delete(1);

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundError when product not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.delete(999)).rejects.toThrow(NotFoundError);
      await expect(service.delete(999)).rejects.toThrow('Product not found');
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
