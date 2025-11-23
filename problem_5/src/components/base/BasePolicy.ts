import { BaseRepository } from './BaseRepository';
export abstract class BasePolicy<T> {
  protected repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  // Check if the user can create a resource
  abstract canCreate(user: any): boolean | Promise<boolean>;

  // Check if the user can read a resource
  abstract canRead(user: any, resourceId?: number): boolean | Promise<boolean>;

  // Check if the user can update a resource
  abstract canUpdate(
    user: any,
    resourceId?: number,
  ): boolean | Promise<boolean>;

  // Check if the user can delete a resource
  abstract canDelete(
    user: any,
    resourceId?: number,
  ): boolean | Promise<boolean>;

  // Check if the user can list resources
  abstract canList(user: any): boolean | Promise<boolean>;
}
