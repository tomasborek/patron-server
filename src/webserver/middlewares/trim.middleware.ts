import type { Request, Response, NextFunction } from 'express';

export default class TrimMiddlewareFactory {
  public getMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.method === 'POST' || req.method === 'PATCH') {
        for (const [key, value] of Object.entries(req.body)) {
          if (typeof value === 'string') req.body[key] = value.trim();
        }
      }
      next();
    };
  }
}
