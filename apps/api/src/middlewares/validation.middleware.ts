import { ZodError, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

type ValidationSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export class ValidationMiddleware {
  static validate(schemas: ValidationSchemas) {
    return (req: Request, _res: Response, next: NextFunction) => {
      try {
        if (schemas.body) {
          req.body = schemas.body.parse(req.body ?? {});
        }

        if (schemas.params) {
          const parsedParams = schemas.params.parse(req.params ?? {});
          Object.defineProperty(req, 'params', {
            value: parsedParams,
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }

        if (schemas.query) {
          const parsedQuery = schemas.query.parse(req.query ?? {});
          Object.defineProperty(req, 'query', {
            value: parsedQuery,
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }

        next();
      } catch (err) {
        if (err instanceof ZodError) {
          const details = err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          }));

          next(
            createHttpError(400, {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details,
            })
          );
        } else {
          next(err);
        }
      }
    };
  }
}
