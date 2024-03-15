import type { Request, Response } from 'express';
import { IBoxUsecase } from '@/usecases';
import { SuccessResponse } from '@/utils/response';

export interface IBoxController {
  createReservation: (req: Request, res: Response) => Promise<void>;
}

export default class BoxController implements IBoxController {
  constructor(private boxUsecase: IBoxUsecase) {}

  public async createReservation(req: Request, res: Response) {
    await this.boxUsecase.createReservation(req.params.boxId, req.user!.id);
    return new SuccessResponse({ res }).send();
  }
}
