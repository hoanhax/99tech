// 403 errors

import { HttpStatus } from '@config/enums';
import { HTTPError } from './HTTPError';

export class ForbiddenError extends HTTPError {
  constructor(
    message: string = 'Forbidden',
    errors?: Record<string, string[]>,
  ) {
    super(HttpStatus.FORBIDDEN, message, errors);
  }
}
