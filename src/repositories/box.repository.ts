import { BoxState, PrismaClient } from '@prisma/client';
import moment from 'moment';
import { IBox, IExtendedBox } from '@/domain/entities/box.entity';
import { IReservation } from '@/domain/entities/reservation.entity';

export interface IBoxRepository {
  getById: (id: string) => Promise<IBox | null>;
  changeState: (id: string, state: BoxState) => Promise<void>;
  canReserve: (id: string, userId: string) => Promise<boolean>;
  create: (stationId: string, localId: number) => Promise<void>;
  createReservation: (boxId: string, userId: string) => Promise<IReservation>;
  isReserved: (id: string) => Promise<boolean>;
  resetToDefault: (id: string) => Promise<void>;
  empty: (id: string) => Promise<void>;
  getExtended: (id: string) => Promise<IExtendedBox | null>;
}

export default class BoxRepository implements IBoxRepository {
  constructor(private db: PrismaClient) {}

  public async create(stationId: string, localId: number) {
    await this.db.box.create({
      data: { stationId, localId },
    });
  }
  public getById(id: string) {
    return this.db.box.findUnique({ where: { id } });
  }

  public async changeState(id: string, state: BoxState) {
    await this.db.box.update({
      where: { id },
      data: { state },
    });
  }
  public async canReserve(id: string, userId: string) {
    return !!(await this.db.box.findUnique({
      where: {
        id,
        station: { institution: { users: { some: { userId } } } },
      },
    }));
  }
  public async isReserved(id: string) {
    return !!(await this.db.reservation.findFirst({
      where: { boxId: id, cancelled: false, completed: false, createdAt: { gte: moment().subtract(24, 'h').toDate() } },
    }));
  }
  public async createReservation(boxId: string, userId: string) {
    return this.db.reservation.create({
      data: { boxId, userId },
    });
  }

  public async resetToDefault(id: string) {
    await this.db.box.update({ where: { id }, data: { state: 'DEFAULT' } });
  }

  public async empty(id: string) {
    await this.db.box.update({ where: { id }, data: { state: 'EMPTY' } });
  }
  public async getExtended(id: string) {
    return this.db.box.findUnique({
      where: { id },
      include: { station: { select: { id: true, institution: { select: { id: true } } } } },
    });
  }
}
