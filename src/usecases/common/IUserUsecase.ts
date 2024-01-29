import { IUserReservationDTO } from '@/domain/entities/reservation.entity';
import { IMeDTO } from '@/domain/entities/user.entity';

interface IUserUsecase {
  getMe: (id: string) => Promise<IMeDTO>;
  auth: (email: string, password: string) => Promise<string>;
  activate: (id: string, password: string) => Promise<string>;
  verify: (tokenId: string, code: number) => Promise<void>;
  getReservations: (id: string) => Promise<IUserReservationDTO[]>;
}

export default IUserUsecase;
