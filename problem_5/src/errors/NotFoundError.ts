import { HttpStatus } from '@config/enums';
import { HTTPError } from './HTTPError';

// 404 errors
export class NotFoundError extends HTTPError {
  constructor(
    message: string = 'Not Found',
    errors?: Record<string, string[]>,
  ) {
    super(HttpStatus.NOT_FOUND, message, errors);
  }
}
