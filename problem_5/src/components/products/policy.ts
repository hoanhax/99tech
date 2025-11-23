import { BasePolicy } from '@components/base/BasePolicy';
import { Permission } from '@utils/permission';
import { Product } from '@prisma/client';

export class ProductPolicy extends BasePolicy<Product> {
  canCreate(user: any): boolean {
    return Permission.isAdmin(user) || Permission.isSeller(user);
  }

  canRead(_user: any, _resourceId?: number): boolean {
    return true;
  }

  async canUpdate(user: any, resourceId?: number): Promise<boolean> {
    return (
      Permission.isAdmin(user) ||
      (Permission.isSeller(user) &&
        !!resourceId &&
        (await Permission.isOwner(user, resourceId, this.repository)))
    );
  }

  async canDelete(user: any, resourceId?: number): Promise<boolean> {
    return (
      Permission.isAdmin(user) ||
      (Permission.isSeller(user) &&
        !!resourceId &&
        (await Permission.isOwner(user, resourceId, this.repository)))
    );
  }

  canList(_user: any): boolean {
    return true;
  }
}
