import { UserRole } from './enums';

export interface IUser {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  createdAt: Date;
  deleted: boolean;
  role: UserRole;
  active: boolean;
  verified: boolean;
}
