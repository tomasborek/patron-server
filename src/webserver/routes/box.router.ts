import { Router } from 'express';
import IBoxController from '../controllers/common/IBoxController';
import { auth, controller } from '../container';

export default class BoxRouterFactory {
  constructor(private controller: IBoxController) {}

  getRouter() {
    return Router().post('/:boxId/reservation', auth, controller(this.controller.createReservation));
  }
}
