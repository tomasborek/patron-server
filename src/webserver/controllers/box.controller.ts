import type { Request, Response } from 'express';
import IBoxController from './common/IBoxController';
import IBoxUsecase from '@/usecases/common/IBoxUsecase';
import { SuccessResponse } from '@/utils/response';

export default class BoxController implements IBoxController {
  constructor(private boxUsecase: IBoxUsecase) {}

  createReservation = async (req: Request, res: Response) => {
    await this.boxUsecase.createReservation(req.params.boxId, req.user!.id);
    return new SuccessResponse({ res }).send();
  };
}
