import { Router } from 'express';
import { IReservationController } from '@/delivery/controllers';
import { auth } from '@/webserver/container';

export default class ReservationRouterFactory {
  constructor(private reservationController: IReservationController) {}

  public getRouter = () => {
    return Router().post('/:reservationId/cancel', auth, this.reservationController.cancel);
  };
}
