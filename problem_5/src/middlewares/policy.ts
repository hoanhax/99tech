import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ForbiddenError } from '@/errors';

export const checkPolicy = (policyFn: Function) => {
  return asyncHandler(async (req: Request, _res: Response, next: Function) => {
    // Extract resource ID from params if present
    const resourceId = req.params.id ? parseInt(req.params.id, 10) : undefined;

    const hasPermission = await policyFn(req.user, resourceId);

    if (!hasPermission) {
      throw new ForbiddenError(
        'You do not have permission to perform this action',
      );
    }

    next();
  });
};
