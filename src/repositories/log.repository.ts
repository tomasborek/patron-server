import { PrismaClient } from '@prisma/client';
import ILogRepository from './common/ILogRepository';
import { ICreateLogData } from '@/domain/entities/log';
import { TLogGet } from '@/webserver/validators/log.validator';

export default class LogRepository implements ILogRepository {
  constructor(private db: PrismaClient) {}
  logAction = async (log: ICreateLogData) => {
    await this.db.log.create({
      data: log,
    });
  };
  get = async (query: TLogGet) => {
    return this.db.log.findMany({
      where: {
        ...query,
      },
    });
  };
}
