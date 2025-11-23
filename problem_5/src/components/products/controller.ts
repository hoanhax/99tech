import { BaseController } from '@components/base/BaseController';
import { Product } from '@prisma/client';
import { asyncHandler } from '@utils/asyncHandler';
import { Request, Response } from 'express';
import {
  ProductCreateInput,
  ProductCreateData,
  ProductListFilters,
  ProductPartialUpdateInput,
  ProductUpdateInput,
} from './types';
import { ProductService } from './service';
import { HttpStatus } from '@config/enums';
import { AuthenticatedRequest } from '@/types/common';

export class ProductController extends BaseController<Product, ProductService> {
  list = asyncHandler(async (req: Request, res: Response) => {
    const filters = req.query as ProductListFilters;
    const result = await this.service.list(filters);

    this.successWithPagination(
      res,
      result.data,
      result.page_meta,
      'Products found successfully',
      HttpStatus.OK,
    );
  });


  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body as ProductCreateInput;


    const data: ProductCreateData = {
      ...body,
      ownerId: req.user.id,
    };

    const product = await this.service.create(data);
    this.success(
      res,
      product,
      'Product created successfully',
      HttpStatus.CREATED,
    );
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = await this.service.findById(id);
    this.success(res, product, 'Product found successfully', HttpStatus.OK);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = req.body as ProductUpdateInput;
    const product = await this.service.update(id, data);
    this.success(res, product, 'Product updated successfully', HttpStatus.OK);
  });

  partialUpdate = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = req.body as ProductPartialUpdateInput;
    const product = await this.service.update(id, data);
    this.success(res, product, 'Product updated successfully', HttpStatus.OK);
  });

  // For quick demo we only support hard delete
  delete = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const product = await this.service.delete(id);
    this.success(res, product, 'Product deleted successfully', HttpStatus.OK);
  });
}
