/**
 * Unit tests for ProductRepository
 * Tests data access layer with mocked Prisma client
 */

import { ProductsRepository } from '@components/products/repository';
import { Prisma } from '@prisma/client';
import { createMockPrismaModel } from '../../utils/mockPrisma';
import { createMockProduct, createMockProducts } from '../../fixtures/products';

// Mock the database config to prevent connection
jest.mock('@config/database', () => ({
  prisma: {
    product: {},
  },
}));

describe('ProductRepository', () => {
  let repository: ProductsRepository;
  let mockPrismaModel: ReturnType<typeof createMockPrismaModel>;

  beforeEach(() => {
    mockPrismaModel = createMockPrismaModel();
    repository = new ProductsRepository();
    // Inject the mock model
    (repository as any).model = mockPrismaModel;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find a product by id', async () => {
      // Arrange
      const mockProduct = createMockProduct({ id: 1 });
      mockPrismaModel.findUnique.mockResolvedValue(mockProduct);

      // Act
      const result = await repository.findById(1);

      // Assert
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockProduct);
    });

    it('should return null when product not found', async () => {
      // Arrange
      mockPrismaModel.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findById(999);

      // Assert
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBeNull();
    });
  });

  describe('findFirst', () => {
    it('should find first product matching conditions', async () => {
      // Arrange
      const mockProduct = createMockProduct({ name: 'Test Product' });
      mockPrismaModel.findFirst.mockResolvedValue(mockProduct);

      // Act
      const result = await repository.findFirst({ name: 'Test Product' });

      // Assert
      expect(mockPrismaModel.findFirst).toHaveBeenCalledWith({ where: { name: 'Test Product' } });
      expect(result).toEqual(mockProduct);
    });

    it('should return null when no product matches', async () => {
      // Arrange
      mockPrismaModel.findFirst.mockResolvedValue(null);

      // Act
      const result = await repository.findFirst({ name: 'Non-existent' });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple products', async () => {
      // Arrange
      const mockProducts = createMockProducts(3);
      mockPrismaModel.findMany.mockResolvedValue(mockProducts);

      // Act
      const result = await repository.findMany({ where: { category: 'Electronics' } });

      // Assert
      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: { category: 'Electronics' },
      });
      expect(result).toEqual(mockProducts);
    });

    it('should support pagination options', async () => {
      // Arrange
      const mockProducts = createMockProducts(2);
      mockPrismaModel.findMany.mockResolvedValue(mockProducts);

      // Act
      const result = await repository.findMany({
        where: { status: 'ACTIVE' },
        skip: 10,
        take: 20,
        cursor: { id: 5 },
      });

      // Assert
      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
        skip: 10,
        take: 20,
        cursor: { id: 5 },
      });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      // Arrange
      const productData = {
        name: 'New Product',
        description: 'Description',
        price: new Prisma.Decimal(99.99),
        category: 'Electronics',
        status: 'ACTIVE' as const,
        stock: 100,
        ownerId: 1,
      };
      const mockProduct = createMockProduct(productData);
      mockPrismaModel.create.mockResolvedValue(mockProduct);

      // Act
      const result = await repository.create(productData);

      // Assert
      expect(mockPrismaModel.create).toHaveBeenCalledWith({ data: productData });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      // Arrange
      const updateData = { name: 'Updated Name', price: new Prisma.Decimal(149.99) };
      const mockProduct = createMockProduct({ id: 1, ...updateData });
      mockPrismaModel.update.mockResolvedValue(mockProduct);

      // Act
      const result = await repository.update({ id: 1 }, updateData);

      // Assert
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      // Arrange
      const mockProduct = createMockProduct({ id: 1 });
      mockPrismaModel.delete.mockResolvedValue(mockProduct);

      // Act
      const result = await repository.delete({ id: 1 });

      // Assert
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('count', () => {
    it('should count products matching conditions', async () => {
      // Arrange
      mockPrismaModel.count.mockResolvedValue(5);

      // Act
      const result = await repository.count({ status: 'ACTIVE' });

      // Assert
      expect(mockPrismaModel.count).toHaveBeenCalledWith({ where: { status: 'ACTIVE' } });
      expect(result).toBe(5);
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple products', async () => {
      // Arrange
      mockPrismaModel.deleteMany.mockResolvedValue({ count: 3 });

      // Act
      const result = await repository.deleteMany({ status: 'INACTIVE' });

      // Assert
      expect(mockPrismaModel.deleteMany).toHaveBeenCalledWith({ where: { status: 'INACTIVE' } });
      expect(result).toBe(3);
    });
  });
});
