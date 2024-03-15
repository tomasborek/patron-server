import { IUserRepository } from '@/repositories';
import { BadRequestError, ForbiddenError, NotFoundError, ServerError } from '@/utils/errors';
import Publisher from '@/observers/publisher';
import { hash } from '@/utils/hash';
import { compare } from 'bcrypt';
import { signToken } from '@/utils/jwt';
import { IInstitutionRepository } from '@/repositories';
import { IMeDTO } from '@/domain/entities/user.entity';
import { IUserReservationDTO } from '@/domain/entities/reservation.entity';
export interface IUserUsecase {
  getMe: (id: string) => Promise<IMeDTO>;
  auth: (email: string, password: string) => Promise<string>;
  activate: (id: string, name: string, password: string) => Promise<string>;
  verify: (tokenId: string, code: number) => Promise<void>;
  getReservations: (id: string) => Promise<IUserReservationDTO[]>;
}
export default class UserUsecase extends Publisher implements IUserUsecase {
  constructor(private userRepository: IUserRepository, private institutionRepository: IInstitutionRepository) {
    super();
  }

  public async getMe(id: string) {
    const user = await this.userRepository.getById(id);
    if (!user) throw new NotFoundError();
    if (!user.active) throw new ForbiddenError();
    const me = await this.userRepository.getMe(id);
    if (!me) throw new ServerError();
    if (user.role === 'DEVELOPER') {
      me.institutions = (await this.institutionRepository.getAllForDev()).map((i) => ({
        id: i.id,
        name: i.name,
        code: '000000',
        role: 'ADMIN',
      }));
    }
    return me;
  }

  public async auth(email: string, password: string) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw new NotFoundError();
    const match = await compare(password, user.password ?? '');
    if (!match) throw new ForbiddenError();
    const token = signToken({ id: user.id, role: user.role });
    return token;
  }

  public async activate(email: string, name: string, password: string) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw new NotFoundError();
    const hashedPassword = await hash(password);
    await this.userRepository.activate(user.id, name, hashedPassword);
    const token = await this.userRepository.createToken(user.id);
    this.notify({ event: 'user-activated', data: { user, token: token.token } });
    return token.id;
  }

  public async verify(tokenId: string, code: number) {
    const token = await this.userRepository.getToken(tokenId);
    if (!token) throw new ForbiddenError();
    if (token.token !== code) throw new ForbiddenError();
    await this.userRepository.verify(token.userId);
  }

  public getReservations(id: string) {
    return this.userRepository.getReservations(id);
  }
}
