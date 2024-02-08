import { Router } from 'express';
import { validate, controller, auth } from '../container';
import logValidator from '../validators/log.validator';
import ILogController from '../controllers/common/ILogController';
export default class LogRouterFactory {
  constructor(private controller: ILogController) {}
  getRouter() {
    return Router().get('/', validate(logValidator.get, { query: true }), auth, controller(this.controller.get));
  }
}
