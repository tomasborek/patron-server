import { LogAction } from '@prisma/client';
import { UserInstitutionRole, UserRole } from './enums';

export interface ILog {
  id: string;
  createdAt: Date;
  boxId: string | null;
  stationId: string | null;
  userId: string | null;
  institutionId: string | null;
  userInstitutionId: string | null;
  action: LogAction;
}

export interface ICreateLogData {
  boxId?: string;
  stationId?: string;
  userId?: string;
  institutionId?: string;
  userInstitutionId?: string;
  action: LogAction;
}

export interface ILogDTO {
  id: string;
  createdAt: Date;
  box: {
    id: string;
    localId: number;
  } | null;
  station: {
    id: string;
    name: string;
  } | null;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
  } | null;
  institution: {
    id: string;
    name: string;
  } | null;
  action: LogAction;
}

export interface ILogsDTO {
  logs: ILogDTO[];
  count: number;
}
