import { prisma } from '@config/database';
import { BaseRepository } from '@components/base/BaseRepository';
import { Product } from '@prisma/client';

export class ProductsRepository extends BaseRepository<Product> {
  constructor() {
    super(prisma.product);
  }
}
