import { Router } from 'express';
import { validate, controller, auth } from '@/webserver/container';
import logValidator from '@/webserver/validators/log.validator';
import { ILogController } from '@/delivery/controllers';
export default class LogRouterFactory {
  constructor(private controller: ILogController) {}

  public getRouter() {
    return Router().get('/', validate(logValidator.get, { query: true }), auth, controller(this.controller.get));
  }
}
