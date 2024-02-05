import { LogAction } from '@prisma/client';

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
