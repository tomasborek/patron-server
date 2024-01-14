import { UserInstitutionRole } from '@/domain/entities/enums';
import { IUserReservationDTO } from '@/domain/entities/reservation.entity';
import type { IMeDTO, IUser } from '@/domain/entities/user.entity';
import { ReservationCreate } from '@/webserver/validators/reservation.validator';

interface IUserRepository {
  create: (email: string, institutionId: string, role: UserInstitutionRole, code: string) => Promise<IUser>;
  getById: (id: string) => Promise<IUser | null>;
  getMe: (id: string) => Promise<IMeDTO | null>;
  getByEmail: (email: string) => Promise<IUser | null>;
  isInInstitution: (userId: string, institutionId: string) => Promise<boolean>;
  getPassword: (id: string) => Promise<string | null>;
  activate: (id: string) => Promise<void>;
  setPassword: (id: string, password: string) => Promise<IUser>;
  createToken: (id: string) => Promise<number>;
  getToken: (id: string) => Promise<number | null>;
  verify: (id: string) => Promise<void>;
  getReservations: (id: string) => Promise<IUserReservationDTO[]>;
  createReservation: (data: ReservationCreate, userId: string) => Promise<void>;
}

export default IUserRepository;
