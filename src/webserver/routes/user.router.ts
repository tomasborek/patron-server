import { Router } from 'express';
import { auth, controller, validate } from '@/webserver/container';
import { IUserController } from '@/delivery/controllers';
import userValidator from '@/webserver/validators/user.validator';

export default class UserRouter {
  constructor(private controller: IUserController) {}

  public getRouter() {
    return Router()
      .post('/auth', validate(userValidator.auth), controller(this.controller.auth.bind(this.controller)))
      .get('/me', auth, controller(this.controller.getMe.bind(this.controller)))
      .get('/reservation', auth, controller(this.controller.getReservations.bind(this.controller)))
      .post('/activate', validate(userValidator.activate), controller(this.controller.activate.bind(this.controller)))
      .post(
        '/verify/:tokenId',
        validate(userValidator.verify),
        controller(this.controller.verify.bind(this.controller)),
      );
  }
}
