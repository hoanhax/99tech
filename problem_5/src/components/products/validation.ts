import { z } from 'zod';
import { BaseValidation } from '@components/base/BaseValidation';
import { STRING_LENGTH } from '@config/constants';
import { ProductStatus } from '@prisma/client';

export class ProductValidation extends BaseValidation {
  // common schema
  nameSchema = z.string().min(STRING_LENGTH.MIN).max(STRING_LENGTH.SHORT);
  descriptionSchema = z.string().max(STRING_LENGTH.LONG).optional();
  priceSchema = z.number().positive();
  categorySchema = z.string().max(STRING_LENGTH.SHORT);
  stockSchema = z.number().int().nonnegative();
  statusSchema = z.nativeEnum(ProductStatus).optional();

  /**
   * List product schema validation
   */
  list = z.object({
    query: z.object({
      // Business filters
      category: this.categorySchema.optional(),
      status: this.statusSchema,
      minPrice: z.coerce.number().positive().optional(), // Convert string to number
      maxPrice: z.coerce.number().positive().optional(),
      search: z.string().max(STRING_LENGTH.MEDIUM).optional(),

      // Pagination parameters (from BaseValidation)
      cursor: this.cursorSchema,
      limit: this.limitSchema,
      direction: this.directionSchema,
    }),
  });

  /**
   * Get product by id schema validation
   */
  findById = z.object({
    params: z.object({
      id: this.idSchema,
    }),
  });

  /**
   * Create product schema validation
   */
  create = z.object({
    body: z.object({
      name: this.nameSchema,
      description: this.descriptionSchema,
      price: this.priceSchema,
      category: this.categorySchema,
      stock: this.stockSchema,
    }),
  });

  /**
   * Update product schema validation
   */
  update = z.object({
    params: z.object({
      id: this.idSchema,
    }),
    body: z.object({
      name: this.nameSchema,
      description: this.descriptionSchema,
      price: this.priceSchema,
      category: this.categorySchema,
      stock: this.stockSchema,
    }),
  });

  /**
   * Partial update product schema validation
   */
  partialUpdate = z.object({
    params: z.object({
      id: this.idSchema,
    }),
    body: z.object({
      name: this.nameSchema.optional(),
      description: this.descriptionSchema,
      price: this.priceSchema.optional(),
      category: this.categorySchema.optional(),
      stock: this.stockSchema.optional(),
    }),
  });

  /**
   * Delete product schema validation
   */
  delete = z.object({
    params: z.object({
      id: this.idSchema,
    }),
  });
}
