import HttpResponse, { ServerErrorResponse } from '@/utils/response';
import type { Request, Response } from 'express';

export default class ControllerMiddlewareFactory {
  constructor() {}
  getMiddleware() {
    return (fn: (req: Request, res: Response) => void) =>
      async (req: Request, res: Response) => {
        try {
          await fn(req, res);
        } catch (error) {
          console.log(error);
          if (!error.status) {
            return new ServerErrorResponse({ res }).send();
          }
          return new HttpResponse({
            res,
            status: error.status,
            message: error.message,
          }).send();
        }
      };
  }
}
