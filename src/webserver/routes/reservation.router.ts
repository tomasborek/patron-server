import { Router } from 'express';
import IReservationController from '../controllers/common/IReservationController';
import { auth } from '../container';

export default class ReservationRouterFactory {
  constructor(private reservationController: IReservationController) {}

  getRouter = () => {
    return Router().post('/:reservationId/cancel', auth, this.reservationController.cancel);
  };
}
