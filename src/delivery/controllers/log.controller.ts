import type { Request, Response } from 'express';
import { ILogUsecase } from '@/usecases';
import { SuccessResponse } from '@/utils/response';

export interface ILogController {
  get(req: Request, res: Response): Promise<void>;
}

export default class LogController implements ILogController {
  constructor(private logUsecase: ILogUsecase) {}

  public async get(req: Request, res: Response) {
    const logs = await this.logUsecase.get(req.query, req.user!.id);
    return new SuccessResponse({ res, data: { logs: logs.logs, count: logs.count } }).send();
  }
}
