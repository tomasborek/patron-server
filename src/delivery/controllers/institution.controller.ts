import type { Request, Response } from 'express';
import { IInstitutionUsecase } from '@/usecases';
import { SuccessResponse } from '@/utils/response';

export interface IInstitutionController {
  create: (req: Request, res: Response) => Promise<void>;
  addUser: (req: Request, res: Response) => Promise<void>;
  removeUser: (req: Request, res: Response) => Promise<void>;
  getStations: (req: Request, res: Response) => Promise<void>;
  createStation: (req: Request, res: Response) => Promise<void>;
  getUsers: (req: Request, res: Response) => Promise<void>;
}

export default class InstitutionController implements IInstitutionController {
  constructor(private institutionUsecase: IInstitutionUsecase) {}

  public async create(req: Request, res: Response) {
    await this.institutionUsecase.create(req.body);
    return new SuccessResponse({ res }).send();
  }
  public async addUser(req: Request, res: Response) {
    await this.institutionUsecase.addUser(req.params.institutionId, req.body.email, req.body.role, req.user!.id);

    return new SuccessResponse({ res }).send();
  }
  public async removeUser(req: Request, res: Response) {
    await this.institutionUsecase.removeUser(req.params.institutionId, req.params.userId, req.user!.id);
    return new SuccessResponse({ res }).send();
  }
  public async getStations(req: Request, res: Response) {
    const stations = await this.institutionUsecase.getStations(req.params.institutionId, req.user!.id);
    return new SuccessResponse({ res, data: { stations } }).send();
  }
  public async createStation(req: Request, res: Response) {
    await this.institutionUsecase.createStation(req.body, req.params.institutionId);
    return new SuccessResponse({ res }).send();
  }
  public async getUsers(req: Request, res: Response) {
    const users = await this.institutionUsecase.getUsers(req.params.institutionId, req.user!.id, req.query);
    return new SuccessResponse({ res, data: { users: users.users, count: users.count } }).send();
  }
}
