import { Response } from 'express';
import { BaseService } from './BaseService';
import { HttpStatus } from '@config/enums';
import { PageMeta } from '@/types/common';

export abstract class BaseController<
  T,
  S extends BaseService<T> = BaseService<T>,
> {
  protected service: S;

  constructor(service: S) {
    this.service = service;
  }

  protected success(
    res: Response,
    data: any,
    message = 'Success',
    statusCode = HttpStatus.OK,
  ) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  protected successWithPagination<D>(
    res: Response,
    data: D[],
    pageMeta: PageMeta,
    message = 'Success',
    statusCode = HttpStatus.OK,
  ) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      page_meta: pageMeta,
    });
  }
}
