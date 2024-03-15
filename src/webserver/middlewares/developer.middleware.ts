import { ForbiddenResponse } from '@/utils/response';
import type { Request, Response, NextFunction } from 'express';

export default class DeveloperMiddlewareFacoty {
  constructor(private authMiddleware: (req: Request, res: Response, next: NextFunction) => void) {}

  public getMiddleware = () => {
    const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
      if (req.user!.role !== 'DEVELOPER') {
        return new ForbiddenResponse({ res }).send();
      }
      next();
    };
    return [this.authMiddleware, adminMiddleware];
  };
}
