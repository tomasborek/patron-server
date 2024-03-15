import type { Request, Response } from 'express';
import { IReservationUsecase } from '@/usecases';
import { SuccessResponse } from '@/utils/response';

export interface IReservationController {
  cancel: (req: Request, res: Response) => Promise<void>;
}

export default class ReservationController implements IReservationController {
  constructor(private reservationUsecase: IReservationUsecase) {}

  public async cancel(req: Request, res: Response) {
    await this.reservationUsecase.cancel(req.params.reservationId, req.user!.id);
    return new SuccessResponse({ res }).send();
  }
}
