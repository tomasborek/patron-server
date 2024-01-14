import { Router } from 'express';
import { auth, controller, validate } from '../container';
import IUserController from '../controllers/common/IUserController';
import userValidator from '../validators/user.validator';
import reservationValidator from '../validators/reservation.validator';

export default class UserRouter {
  constructor(private controller: IUserController) {}

  getRouter() {
    return Router()
      .post('/auth', validate(userValidator.auth), controller(this.controller.auth))
      .get('/me', auth, controller(this.controller.getMe))
      .get('/reservation', auth, controller(this.controller.getReservations))
      .post('/reservation', auth, validate(reservationValidator.create), controller(this.controller.createReservation));
  }
}
