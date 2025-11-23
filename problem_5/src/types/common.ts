import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: NonNullable<Request['user']>;
}

export type PrismaDelegate<T> = {
  findMany: (args?: any) => Promise<T[]>;
  findUnique: (args: any) => Promise<T | null>;
  findFirst: (args?: any) => Promise<T | null>;
  create: (args: any) => Promise<T>;
  update: (args: any) => Promise<T>;
  delete: (args: any) => Promise<T>;
  deleteMany: (args?: any) => Promise<{ count: number }>;
  count: (args?: any) => Promise<number>;
};

export interface PageMeta {
  next_cursor: string | null;
  prev_cursor: string | null;
  has_more: boolean;
  count?: number;
}

// Pagination request parameters
export interface PaginationParams {
  cursor?: string;
  limit?: number;
  direction?: 'next' | 'prev';
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  page_meta: PageMeta;
}
