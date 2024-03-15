import { Router } from 'express';
import { auth, controller, validate } from '@/webserver/container';
import { IUserController } from '@/delivery/controllers';
import userValidator from '@/webserver/validators/user.validator';

export default class UserRouter {
  constructor(private controller: IUserController) {}

  public getRouter() {
    return Router()
      .post('/auth', validate(userValidator.auth), controller(this.controller.auth))
      .get('/me', auth, controller(this.controller.getMe))
      .get('/reservation', auth, controller(this.controller.getReservations))
      .post('/activate', validate(userValidator.activate), controller(this.controller.activate))
      .post('/verify/:tokenId', validate(userValidator.verify), controller(this.controller.verify));
  }
}
