import { UserInstitutionRole } from './enums';

export interface IInstitution {
  id: string;
  name: string;
  createdAt: Date;
  deleted: boolean;
}

export interface ISimpleInstitution {
  id: string;
  name: string;
  role: UserInstitutionRole;
  code: string;
}

export interface IGetUsersQuery {
  page?: string;
}
