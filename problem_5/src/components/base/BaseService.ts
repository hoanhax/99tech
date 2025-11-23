import { BaseRepository } from './BaseRepository';
import { PaginatedResponse, PaginationParams } from '@/types/common';

export abstract class BaseService<T> {
  protected repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  /**
   * Helper method for paginated list operations
   * Can be overridden by child services for custom logic
   */
  protected async paginatedList(
    pagination: PaginationParams,
    options?: {
      where?: any;
      select?: any;
      include?: any;
      orderBy?: any;
    },
  ): Promise<PaginatedResponse<T>> {
    const { cursor, limit, direction } = pagination;

    return this.repository.findManyWithPagination({
      ...options,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      take: limit,
      direction,
    });
  }
}
