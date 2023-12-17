import { Router } from 'express';
import { controller, validate } from '../container';
import IUserController from '../controllers/common/IUserController';
import userValidator from '../validators/user.validator';

export default class UserRouter {
  constructor(private controller: IUserController) {}

  getRouter() {
    return Router().post(
      '/auth',
      validate(userValidator.auth),
      controller(this.controller.auth)
    );
  }
}
