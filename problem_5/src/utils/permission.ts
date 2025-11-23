import { Role } from '@config/enums';

export class Permission {
  static isAdmin(user: any): boolean {
    return user?.role === Role.ADMIN;
  }

  static isLoggedIn(user: any): boolean {
    return user !== null;
  }

  static isUser(user: any): boolean {
    return user?.role === Role.USER;
  }

  static isSeller(user: any): boolean {
    return user?.role === Role.SELLER;
  }

  static async isOwner(
    user: any,
    resourceId: number,
    repository: any,
    ownerField: string = 'ownerId',
  ): Promise<boolean> {
    const resource = await repository.findById(resourceId);
    return resource?.[ownerField] === user?.id;
  }
}
