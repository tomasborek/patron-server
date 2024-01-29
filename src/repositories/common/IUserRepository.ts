import { UserInstitutionRole } from '@/domain/entities/enums';
import { IUserReservationDTO } from '@/domain/entities/reservation.entity';
import type { IMeDTO, IToken, IUser } from '@/domain/entities/user.entity';

interface IUserRepository {
  create: (email: string, institutionId: string, role: UserInstitutionRole, code: string) => Promise<IUser>;
  getById: (id: string) => Promise<IUser | null>;
  getMe: (id: string) => Promise<IMeDTO | null>;
  getByEmail: (email: string) => Promise<IUser | null>;
  isInInstitution: (userId: string, institutionId: string) => Promise<boolean>;
  getPassword: (id: string) => Promise<string | null>;
  activate: (id: string, password: string) => Promise<void>;
  createToken: (id: string) => Promise<IToken>;
  getToken: (id: string) => Promise<IToken | null>;
  verify: (id: string) => Promise<void>;
  getReservations: (id: string) => Promise<IUserReservationDTO[]>;
}

export default IUserRepository;
