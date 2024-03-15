import { Router } from 'express';
import { developer, validate, controller, auth } from '@/webserver/container';
import { IInstitutionController } from '@/delivery/controllers';
import institutionValidator from '@/webserver/validators/institution.validator';

export default class InstitutionRouter {
  constructor(private controller: IInstitutionController) {}

  public getRouter() {
    return Router()
      .post(
        '/',
        developer,
        validate(institutionValidator.create),
        controller(this.controller.create.bind(this.controller)),
      )
      .post(
        '/:institutionId/user',
        auth,
        validate(institutionValidator.addUser),
        controller(this.controller.addUser.bind(this.controller)),
      )
      .get('/:institutionId/station', auth, controller(this.controller.getStations.bind(this.controller)))
      .get(
        '/:institutionId/user',
        validate(institutionValidator.getUsers, { query: true }),
        auth,
        controller(this.controller.getUsers.bind(this.controller)),
      )
      .post(
        '/:institutionId/station',
        validate(institutionValidator.createStation),
        controller(this.controller.createStation.bind(this.controller)),
      );
  }
}
