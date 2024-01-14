import IUserRepository from '@/repositories/common/IUserRepository';
import IUserUsecase from './common/IUserUsecase';
import IInstitutionRepository from '@/repositories/common/IInstitutionRepository';
import { BadRequestError, ForbiddenError, NotFoundError, ServerError } from '@/utils/errors';
import Publisher from '@/observers/publisher';
import { hash } from '@/utils/hash';
import { compare } from 'bcrypt';
import { signToken } from '@/utils/jwt';
import IBoxRepository from '@/repositories/common/IBoxRepository';
import { ReservationCreate } from '@/webserver/validators/reservation.validator';

export default class UserUsecase extends Publisher implements IUserUsecase {
  constructor(
    private userRepository: IUserRepository,
    private institutionRepository: IInstitutionRepository,
    private boxRepository: IBoxRepository,
  ) {
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
    if (!user.active) {
      await this.userRepository.activate(user.id);
      const hashedPassword = await hash(password);
      await this.userRepository.setPassword(user.id, hashedPassword);
      this.notify({ event: 'user-activated', data: { user } });
    } else {
      const match = await compare(password, user.password ?? '');
      if (!match) throw new ForbiddenError();
    }
    const token = signToken({ id: user.id, role: user.role });
    return token;
  };
  getReservations = (id: string) => {
    return this.userRepository.getReservations(id);
  };
  createReservation = async (data: ReservationCreate, userId: string) => {
    const box = await this.boxRepository.getById(data.boxId);
    if (!box) throw new NotFoundError();
    if (box.state !== 'DEFAULT') throw new BadRequestError('Box is not available');
    const canReserve = await this.boxRepository.canReserve(box.id, userId);
    if (!canReserve) throw new ForbiddenError('You cannot reserve this box');
    await this.userRepository.createReservation(data, userId);
  };
}
