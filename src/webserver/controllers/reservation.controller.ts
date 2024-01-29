import type { Request, Response } from 'express';
import IReservationController from './common/IReservationController';
import IReservationUsecase from '@/usecases/common/IReservationUsecase';
import { SuccessResponse } from '@/utils/response';

export default class ReservationController implements IReservationController {
  constructor(private reservationUsecase: IReservationUsecase) {}

  cancel = async (req: Request, res: Response) => {
    await this.reservationUsecase.cancel(req.params.reservationId, req.user!.id);
    return new SuccessResponse({ res }).send();
  };
}
