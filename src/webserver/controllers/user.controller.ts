import type { Request, Response } from 'express';
import IUserController from './common/IUserController';
import IUserUsecase from '@/usecases/common/IUserUsecase';
import { CreatedResponse, SuccessResponse } from '@/utils/response';

export default class UserController implements IUserController {
  constructor(private userUsecase: IUserUsecase) {}
  getMe = async (req: Request, res: Response) => {
    const me = await this.userUsecase.getMe(req.user!.id);
    return new CreatedResponse({ res, data: { me } }).send();
  };
  auth = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await this.userUsecase.auth(email, password);
    return new CreatedResponse({ res, data: { token } }).send();
  };
  getReservations = async (req: Request, res: Response) => {
    const reservations = await this.userUsecase.getReservations(req.user!.id);
    return new SuccessResponse({ res, data: { reservations } }).send();
  };
  createReservation = async (req: Request, res: Response) => {
    await this.userUsecase.createReservation(req.body, req.user!.id);
    return new SuccessResponse({ res }).send();
  };
}
