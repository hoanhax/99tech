import { PrismaDelegate, PageMeta, PaginatedResponse } from '@/types/common';

export abstract class BaseRepository<T> {
  protected model: PrismaDelegate<T>;
  constructor(model: PrismaDelegate<T>) {
    this.model = model;
  }

  protected getDelegate(): PrismaDelegate<T> {
    return this.model;
  }

  /**
   * Find by id value
   * @param id number Record id
   * @returns Promise<T | null>
   */
  async findById(id: number): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  /**
   * Find first record by conditions
   * @param where object Conditions to find record
   * @returns Promise<T | null>
   */
  async findFirst(where: object = {}): Promise<T | null> {
    return this.model.findFirst({ where });
  }

  /**
   * Find many records by conditions and options
   * @param options object Options to find records
   * @returns Promise<T[]>
   */
  async findMany(options?: {
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    cursor?: any;
    distinct?: any;
  }): Promise<T[]> {
    const delegate = this.getDelegate();
    return await delegate.findMany(options);
  }

  /**
   * Find many records with pagination metadata
   * @param options Prisma query options including cursor, take, orderBy
   * @returns Promise<PaginatedResponse<T>> Data with pagination metadata
   */
  async findManyWithPagination(options?: {
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
    cursor?: any;
    take?: number;
    direction?: 'next' | 'prev';
  }): Promise<PaginatedResponse<T>> {
    const { direction = 'next', take = 10, cursor, ...restOptions } = options || {};

    // Fetch one extra record to determine if there are more results
    const limit = take + 1;

    const records = await this.model.findMany({
      ...restOptions,
      cursor,
      take: direction === 'prev' ? -limit : limit,
      skip: cursor ? 1 : 0, // Skip the cursor record itself
    });

    // Determine if there are more records
    const hasMore = records.length > take;

    // Remove the extra record if it exists
    // When going forward (next), the extra record is at the end, so slice from start
    // When going backward (prev), the extra record is at the beginning, so slice from position 1
    const finalData =
      hasMore
        ? direction === 'prev'
          ? records.slice(1)
          : records.slice(0, take)
        : records;

    // Build page_meta
    // next_cursor: points to the last item if there are more records ahead
    // prev_cursor: points to the first item if there are more records behind
    const page_meta: PageMeta = {
      next_cursor:
        finalData.length > 0 &&
        ((direction === 'next' && hasMore) || (direction === 'prev' && cursor))
          ? this.getCursorValue(finalData[finalData.length - 1])
          : null,
      prev_cursor:
        finalData.length > 0 &&
        ((direction === 'next' && cursor) || (direction === 'prev' && hasMore))
          ? this.getCursorValue(finalData[0])
          : null,
      has_more: hasMore,
      count: finalData.length,
    };

    return { data: finalData, page_meta };
  }

  /**
   * Extract cursor value from a record
   * Override this method if using a different cursor field
   */
  protected getCursorValue(record: any): string {
    return String(record.id);
  }

  /**
   * Find one record by conditions
   * @param options object Options to find record
   * @returns Promise<T | null>
   */
  async findOne(options: {
    where: any;
    select?: any;
    include?: any;
  }): Promise<T | null> {
    const delegate = this.getDelegate();
    return await delegate.findUnique(options);
  }

  /**
   * Count records by conditions
   * @param where object Conditions to count records
   * @returns Promise<number> Number of records
   */
  async count(where: object = {}): Promise<number> {
    return this.model.count({ where });
  }

  /**
   * Create a new record
   * @param data any Data to create
   * @returns Promise<T>
   */
  async create(data: any): Promise<T> {
    const delegate = this.getDelegate();
    return await delegate.create({ data });
  }

  /**
   * Update a record
   * @param where any Where conditions
   * @param data any Data to update
   * @returns Promise<T>
   */
  async update(where: any, data: any): Promise<T> {
    const delegate = this.getDelegate();
    return await delegate.update({ where, data });
  }

  /**
   * Delete a record
   * @param where any Where conditions
   * @returns Promise<T>
   */
  async delete(where: any): Promise<T> {
    const delegate = this.getDelegate();
    return await delegate.delete({ where });
  }

  /**
   * Delete many records by conditions
   * @param where object Conditions to delete records
   * @returns Promise<number> Number of deleted records
   */
  async deleteMany(where: object = {}): Promise<number> {
    const result = await this.model.deleteMany({ where });
    return result.count;
  }

  /**
   * Soft delete a record by id
   * NOTE: This will not delete the record from the database, but will set the deletedAt field to the current date
   *       We also have another approach for softDelete using 'archive table'. It is more complex but more flexible and efficient for large datasets
   * @param id number Record id
   * @returns Promise<T>
   */
  async softDelete(id: number): Promise<T> {
    return await this.model.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restore a soft deleted record by id
   *
   * @param id number Record id
   * @returns Promise<T>
   */
  async restore(id: number): Promise<T> {
    return await this.model.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}
