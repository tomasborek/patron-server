import { Router } from 'express';
import { developer, validate, controller, auth } from '../container';
import IInstitutionController from '../controllers/common/IInstitutionController';
import institutionValidator from '../validators/institution.validator';

export default class InstitutionRouter {
  constructor(private controller: IInstitutionController) {}
  getRouter() {
    return Router()
      .post(
        '/',
        developer,
        validate(institutionValidator.create),
        controller(this.controller.create)
      )
      .post(
        '/:institutionId/user',
        auth,
        validate(institutionValidator.addUser),
        controller(this.controller.addUser)
      );
  }
}
