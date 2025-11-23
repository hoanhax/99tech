import { BaseService } from '@components/base/BaseService';
import { Product } from '@prisma/client';
import {
  ProductCreateData,
  ProductListFilters,
  ProductPartialUpdateInput,
  ProductUpdateInput,
} from './types';
import { BadRequestError, NotFoundError } from '@/errors';
import { PaginatedResponse } from '@/types/common';

export class ProductService extends BaseService<Product> {
  async create(data: ProductCreateData): Promise<Product> {
    const nameExisting = await this.repository.findFirst({ name: data.name });
    if (nameExisting) {
      throw new BadRequestError('Product name already exists');
    }
    return this.repository.create(data);
  }

  async findById(id: number): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  async list(filters: ProductListFilters): Promise<PaginatedResponse<Product>> {
    const { category, status, search, minPrice, maxPrice, cursor, limit, direction } =
      filters;

    const queryFilters: any = {};

    if (category) {
      queryFilters.category = category;
    }
    if (status) {
      queryFilters.status = status;
    }

    // Search based on name and description using Prisma syntax
    if (search) {
      queryFilters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Price range filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      queryFilters.price = {};
      if (minPrice !== undefined) queryFilters.price.gte = minPrice;
      if (maxPrice !== undefined) queryFilters.price.lte = maxPrice;
    }

    return this.paginatedList(
      { cursor, limit, direction },
      {
        where: queryFilters,
        orderBy: { id: 'asc' },
      },
    );
  }

  async update(
    id: number,
    data: ProductUpdateInput | ProductPartialUpdateInput,
  ): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    if (data.price !== undefined && data.price <= 0) {
      throw new BadRequestError('Price must be greater than 0');
    }

    return this.repository.update(
      { id },
      {
        ...data,
        updatedAt: new Date(),
      },
    );
  }

  async delete(id: number): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return this.repository.delete({ id });
  }
}
