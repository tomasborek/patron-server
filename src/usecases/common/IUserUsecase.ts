import { IUserReservationDTO } from '@/domain/entities/reservation.entity';
import { IMeDTO } from '@/domain/entities/user.entity';
import { ReservationCreate } from '@/webserver/validators/reservation.validator';

interface IUserUsecase {
  getMe: (id: string) => Promise<IMeDTO>;
  auth: (email: string, password: string) => Promise<string>;
  activate: (id: string, password: string) => Promise<string>;
  verify: (tokenId: string, code: number) => Promise<void>;
  getReservations: (id: string) => Promise<IUserReservationDTO[]>;
  createReservation: (data: ReservationCreate, userId: string) => Promise<void>;
}

export default IUserUsecase;
