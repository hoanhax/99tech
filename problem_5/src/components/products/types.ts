import { ProductStatus } from '@prisma/client';
import { PaginationParams } from '@/types/common';

export interface ProductCreateInput {
  name: string;
  description?: string | null;
  price: number;
  category: string;
  stock?: number;
  status?: ProductStatus;
}

export type ProductCreateData = ProductCreateInput & {ownerId: number}

// Derived from ProductCreateInput with all fields optional, excluding ownerId
export type ProductUpdateInput = ProductCreateInput;

export type ProductPartialUpdateInput = Partial<ProductUpdateInput>;

export interface ProductListFilters extends PaginationParams {
  category?: string;
  status?: ProductStatus;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}
