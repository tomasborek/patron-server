import { UserInstitutionRole, UserRole } from './enums';

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

export interface IInstitutionUserDTO {
  id: string;
  name: string | null;
  institutionRole: UserInstitutionRole;
  role: UserRole;
  email: string;
  createdAt: Date;
  active: boolean;
  verified: boolean;
}

export interface IMeDTO {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  institutions: {
    id: string;
    name: string;
    role: UserInstitutionRole;
    code: string;
  }[];
}

export interface IToken {
  id: string;
  token: number;
  createdAt: Date;
  userId: string;
  valid: boolean;
}
