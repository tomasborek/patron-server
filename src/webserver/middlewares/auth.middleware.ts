import UserRepository from '@/repositories/user.repository';
import { validateToken } from '@/utils/jwt';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedResponse } from '@/utils/response';

export default class AuthMiddlewareFactory {
  constructor(private userRepository: UserRepository) {}

  getMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.headers.authorization?.includes('Bearer')) {
        return new UnauthorizedResponse({
          res,
          message: 'Authorization token malformed',
        }).send();
      }

      if (req.headers.authorization?.split(' ').length != 2) {
        return new UnauthorizedResponse({
          res,
          message: 'Authorization token malformed',
        }).send();
      }

      const token = req.headers.authorization?.split(' ')[1];

      const jwtPayload = validateToken(token);

      if (!jwtPayload) {
        return new UnauthorizedResponse({
          res,
          message: 'Invalid token',
        }).send();
      }

      const user = await this.userRepository.getById(jwtPayload.id);

      if (!user) {
        return new UnauthorizedResponse({
          res,
          message: 'Invalid token',
        }).send();
      }

      req.user = { id: user.id, role: user.role };
      next();
    };
  };
}
