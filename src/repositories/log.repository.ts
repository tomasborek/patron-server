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
      select: {
        id: true,
        createdAt: true,
        action: true,
        box: {
          select: {
            id: true,
            localId: true,
          },
        },
        station: {
          select: {
            id: true,
            name: true,
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  };
}
