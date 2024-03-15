import type { Request, Response } from 'express';
import { IUserUsecase } from '@/usecases';
import { CreatedResponse, SuccessResponse } from '@/utils/response';

export interface IUserController {
  auth: (req: Request, res: Response) => Promise<void>;
  getMe: (req: Request, res: Response) => Promise<void>;
  activate: (req: Request, res: Response) => Promise<void>;
  verify: (req: Request, res: Response) => Promise<void>;
  getReservations: (req: Request, res: Response) => Promise<void>;
}

export default class UserController implements IUserController {
  constructor(private userUsecase: IUserUsecase) {}

  public async getMe(req: Request, res: Response) {
    const me = await this.userUsecase.getMe(req.user!.id);
    return new CreatedResponse({ res, data: { me } }).send();
  }

  public async auth(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await this.userUsecase.auth(email, password);
    return new CreatedResponse({ res, data: { token } }).send();
  }

  public async activate(req: Request, res: Response) {
    const tokenId = await this.userUsecase.activate(req.body.email, req.body.name, req.body.password);
    return new SuccessResponse({ res, data: { tokenId } }).send();
  }

  public async verify(req: Request, res: Response) {
    await this.userUsecase.verify(req.params.tokenId, req.body.code);
    return new SuccessResponse({ res }).send();
  }

  public async getReservations(req: Request, res: Response) {
    const reservations = await this.userUsecase.getReservations(req.user!.id);
    return new SuccessResponse({ res, data: { reservations } }).send();
  }
}
