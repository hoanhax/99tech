// middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '@/errors';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query as any;
      if (parsed.params) req.params = parsed.params as any;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.reduce(
          (acc, err) => {
            const field = err.path.join('.');
            if (!acc[field]) {
              acc[field] = [];
            }
            acc[field].push(err.message);
            return acc;
          },
          {} as Record<string, string[]>,
        );
        next(new ValidationError('Validation failed', errors));
      } else {
        next(error);
      }
    }
  };
};
