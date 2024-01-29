import IUserRepository from '@/repositories/common/IUserRepository';
import IUserUsecase from './common/IUserUsecase';
import { BadRequestError, ForbiddenError, NotFoundError, ServerError } from '@/utils/errors';
import Publisher from '@/observers/publisher';
import { hash } from '@/utils/hash';
import { compare } from 'bcrypt';
import { signToken } from '@/utils/jwt';
import IBoxRepository from '@/repositories/common/IBoxRepository';

export default class UserUsecase extends Publisher implements IUserUsecase {
  constructor(private userRepository: IUserRepository, private boxRepository: IBoxRepository) {
    super();
  }

  getMe = async (id: string) => {
    const user = await this.userRepository.getById(id);
    if (!user) throw new NotFoundError();
    if (!user.active) throw new ForbiddenError();
    const me = await this.userRepository.getMe(id);
    if (!me) throw new ServerError();
    return me;
  };

  auth = async (email: string, password: string) => {
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw new NotFoundError();
    const match = await compare(password, user.password ?? '');
    if (!match) throw new ForbiddenError();
    const token = signToken({ id: user.id, role: user.role });
    return token;
  };

  activate = async (email: string, password: string) => {
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw new NotFoundError();
    const hashedPassword = await hash(password);
    await this.userRepository.activate(user.id, hashedPassword);
    const token = await this.userRepository.createToken(user.id);
    this.notify({ event: 'user-activated', data: { user, token: token.token } });
    return token.id;
  };

  verify = async (tokenId: string, code: number) => {
    const token = await this.userRepository.getToken(tokenId);
    if (!token) throw new ForbiddenError();
    if (token.token !== code) throw new ForbiddenError();
    await this.userRepository.verify(token.userId);
  };

  getReservations = (id: string) => {
    return this.userRepository.getReservations(id);
  };
}
