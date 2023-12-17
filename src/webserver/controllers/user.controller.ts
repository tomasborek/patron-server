import type { Request, Response } from 'express';
import IUserController from './common/IUserController';
import IUserUsecase from '@/usecases/common/IUserUsecase';
import { CreatedResponse } from '@/utils/response';

export default class UserController implements IUserController {
  constructor(private userUsecase: IUserUsecase) {}
  auth = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await this.userUsecase.auth(email, password);
    return new CreatedResponse({ res, data: { token } }).send();
  };
}
