import { PrismaClient } from '@prisma/client';
import { ICreateLogData, ILogDTO } from '@/domain/entities/log';
import { TLogGet } from '@/webserver/validators/log.validator';

export interface ILogRepository {
  logAction(log: ICreateLogData): Promise<void>;
  get(query: TLogGet): Promise<ILogDTO[]>;
  count(query: TLogGet): Promise<number>;
}

export default class LogRepository implements ILogRepository {
  constructor(private db: PrismaClient) {}

  public async logAction(log: ICreateLogData) {
    await this.db.log.create({
      data: log,
    });
  }

  public async get(query: TLogGet) {
    return this.db.log.findMany({
      where: {
        institutionId: query.institutionId,
        userId: query.userId,
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
      take: 5,
      skip: query.page ? (Number(query.page) - 1) * 5 : 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async count(query: TLogGet) {
    return this.db.log.count({
      where: {
        institutionId: query.institutionId,
        userId: query.userId,
      },
    });
  }
}
