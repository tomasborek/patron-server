import type { Request, Response } from 'express';
import ILogController from './common/ILogController';
import ILogUsecase from '@/usecases/common/IlogUsecase';
import { SuccessResponse } from '@/utils/response';

export default class LogController implements ILogController {
  constructor(private logUsecase: ILogUsecase) {}

  get = async (req: Request, res: Response) => {
    const logs = await this.logUsecase.get(req.query, req.user!.id);
    return new SuccessResponse({ res, data: { logs } }).send();
  };
}
