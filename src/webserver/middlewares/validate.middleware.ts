import type { Request, Response, NextFunction } from 'express';
import type { ZodError, ZodSchema } from 'zod';

export class ValidateMiddlewareFactory {
  public getMiddleware() {
    return (schema: ZodSchema, options?: { query: boolean }) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        try {
          await schema.parseAsync(options?.query ? req.query : req.body);
          next();
        } catch (error) {
          const err = error as ZodError;
          res.status(400).json({
            message: err.message,
            data: err.issues,
          });
        }
      };
    };
  }
}
