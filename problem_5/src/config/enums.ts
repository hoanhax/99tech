// Export enums from prisma client, which defined in schema.prisma

export { Role, UserStatus, ProductStatus } from '@prisma/client';

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  VALIDATION_ERROR = 422,
  INTERNAL_SERVER_ERROR = 500,
}
