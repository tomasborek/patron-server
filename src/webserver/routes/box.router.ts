import { Router } from 'express';
import { IBoxController } from '@/delivery/controllers';
import { auth, controller } from '../container';

export default class BoxRouterFactory {
  constructor(private controller: IBoxController) {}

  public getRouter() {
    return Router().post('/:boxId/reservation', auth, controller(this.controller.createReservation));
  }
}
