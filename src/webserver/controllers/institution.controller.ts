import type { Request, Response } from 'express';
import IInstitutionController from './common/IInstitutionController';
import IInstitutionUsecase from '@/usecases/common/IInstitutionUsecase';
import { SuccessResponse } from '@/utils/response';

export default class InstitutionController implements IInstitutionController {
  constructor(private institutionUsecase: IInstitutionUsecase) {}
  create = async (req: Request, res: Response) => {
    await this.institutionUsecase.create(req.body);
    return new SuccessResponse({ res }).send();
  };
  addUser = async (req: Request, res: Response) => {
    await this.institutionUsecase.addUser(
      req.params.institutionId,
      req.body.email,
      req.body.role,
      req.user!.id
    );
    return new SuccessResponse({ res }).send();
  };
}
