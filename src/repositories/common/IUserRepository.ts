import { UserInstitutionRole } from '@/domain/entities/enums';
import type { IUser } from '@/domain/entities/user.entity';

interface IUserRepository {
  create: (
    email: string,
    institutionId: string,
    role: UserInstitutionRole
  ) => Promise<IUser>;
  getById: (id: string) => Promise<IUser | null>;
  getByEmail: (email: string) => Promise<IUser | null>;
  isInInstitution: (userId: string, institutionId: string) => Promise<boolean>;
  getPassword: (id: string) => Promise<string | null>;
  activate: (id: string) => Promise<void>;
  setPassword: (id: string, password: string) => Promise<IUser>;
  createToken: (id: string) => Promise<number>;
  getToken: (id: string) => Promise<number | null>;
  verify: (id: string) => Promise<void>;
}

export default IUserRepository;
