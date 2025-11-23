import { HTTPError } from './HTTPError';
import { HttpStatus } from '@config/enums';

export class ValidationError extends HTTPError {
  constructor(
    message: string = 'Validation failed',
    errors?: Record<string, string[]>,
  ) {
    super(HttpStatus.VALIDATION_ERROR, message, errors);
  }
}
