import { PrismaClient } from '@prisma/client';
import ILogRepository from './common/ILogRepository';
import { ICreateLogData } from '@/domain/entities/log';

export default class LogRepository implements ILogRepository {
  constructor(private db: PrismaClient) {}
  logAction = async (log: ICreateLogData) => {
    await this.db.log.create({
      data: log,
    });
  };
}
