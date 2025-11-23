import { HTTPError } from './HTTPError';
import { HttpStatus } from '@config/enums';

// 400 errors
export class BadRequestError extends HTTPError {
  constructor(
    message: string = 'Bad Request',
    errors?: Record<string, string[]>,
  ) {
    super(HttpStatus.BAD_REQUEST, message, errors);
  }
}
