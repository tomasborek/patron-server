import { IBox } from '@/domain/entities/box.entity';
import { UserInstitutionRole } from '@/domain/entities/enums';
import { IReservation, IReservationWithBox, IUserReservationDTO } from '@/domain/entities/reservation.entity';
import type { IMeDTO, IToken, IUser } from '@/domain/entities/user.entity';

interface IUserRepository {
  create: (email: string, institutionId: string, role: UserInstitutionRole, code: string) => Promise<IUser>;
  getById: (id: string) => Promise<IUser | null>;
  getMe: (id: string) => Promise<IMeDTO | null>;
  getByCode: (code: string, institutionId: string) => Promise<IUser | null>;
  getByEmail: (email: string) => Promise<IUser | null>;
  isInInstitution: (userId: string, institutionId: string) => Promise<boolean>;
  getPassword: (id: string) => Promise<string | null>;
  activate: (id: string, password: string) => Promise<void>;
  createToken: (id: string) => Promise<IToken>;
  getToken: (id: string) => Promise<IToken | null>;
  verify: (id: string) => Promise<void>;
  getActiveReservations: (id: string) => Promise<IReservationWithBox[]>;
  getReservations: (id: string) => Promise<IUserReservationDTO[]>;
  hasUnreturnedBorrow: (id: string, stationId: string) => Promise<boolean>;
  getActiveBorrowBox: (id: string, stationId: string) => Promise<IBox | null>;
}

export default IUserRepository;
