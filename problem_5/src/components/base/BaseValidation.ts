import { z } from 'zod';
import { MAX_TAKE, DEFAULT_TAKE } from '@config/constants';

export abstract class BaseValidation {
  // Common validation schemas
  protected idSchema = z.coerce.number().int().positive();

  // Pagination validation schemas
  protected cursorSchema = z.string().optional();

  protected limitSchema = z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_TAKE)
    .optional()
    .default(DEFAULT_TAKE);

  protected directionSchema = z
    .enum(['next', 'prev'])
    .optional()
    .default('next');

  // Reusable pagination query schema
  protected paginationQuerySchema = z.object({
    cursor: this.cursorSchema,
    limit: this.limitSchema,
    direction: this.directionSchema,
  });
}
