import IUserRepository from '@/repositories/common/IUserRepository';
import IUserUsecase from './common/IUserUsecase';
import IInstitutionRepository from '@/repositories/common/IListingRepository';
import {
  AlreadyExistsError,
  ForbiddenError,
  NotFoundError,
} from '@/utils/errors';
import Publisher from '@/observers/publisher';
import { hash } from '@/utils/hash';
import { compare } from 'bcrypt';
import { signToken } from '@/utils/jwt';

export default class UserUsecase extends Publisher implements IUserUsecase {
  constructor(
    private userRepository: IUserRepository,
    private institutionRepository: IInstitutionRepository
  ) {
    super();
  }

  auth = async (email: string, password: string) => {
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw new NotFoundError();
    if (!user.active) {
      await this.userRepository.activate(user.id);
      const hashedPassword = await hash(password);
      await this.userRepository.setPassword(user.id, hashedPassword);
    } else {
      const match = await compare(password, user.password ?? '');
      if (!match) throw new ForbiddenError();
    }
    const token = signToken({ id: user.id, role: user.role });
    return token;
  };
}
