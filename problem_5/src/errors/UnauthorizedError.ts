import { HttpStatus } from '@config/enums';
import { HTTPError } from './HTTPError';

// 401 errors
export class UnauthorizedError extends HTTPError {
  constructor(
    message: string = 'Unauthorized',
    errors?: Record<string, string[]>,
  ) {
    super(HttpStatus.UNAUTHORIZED, message, errors);
  }
}
