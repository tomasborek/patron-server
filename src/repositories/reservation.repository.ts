import { IReservation, IReservationLogData, IReservationWithBox } from '@/domain/entities/reservation.entity';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';

export interface IReservationRepository {
  getById: (id: string) => Promise<IReservation | null>;
  isActive: (id: string) => Promise<boolean>;
  getLogData: (id: string) => Promise<IReservationLogData | null>;
  cancel: (id: string) => Promise<void>;
  complete: (id: string) => Promise<void>;
  getByUserId: (userId: string) => Promise<IReservationWithBox | null>;
}

export default class ReservationRepository implements IReservationRepository {
  constructor(private db: PrismaClient) {}

  public getById(id: string) {
    return this.db.reservation.findUnique({ where: { id } });
  }

  public async isActive(id: string) {
    return !!(await this.db.reservation.findUnique({
      where: { id, cancelled: false, completed: false, createdAt: { gte: moment().subtract(24, 'h').toDate() } },
    }));
  }
  public getLogData(id: string) {
    return this.db.reservation.findUnique({
      where: { id },
      include: {
        box: { select: { id: true, station: { select: { id: true, institution: { select: { id: true } } } } } },
      },
    });
  }
  public async cancel(id: string) {
    await this.db.reservation.update({
      where: { id },
      data: { cancelled: true, cancelledAt: new Date() },
    });
  }

  public async complete(id: string) {
    await this.db.reservation.update({
      where: { id },
      data: { completed: true },
    });
  }

  public getByUserId(userId: string) {
    return this.db.reservation.findFirst({
      where: { userId, cancelled: false, completed: false, createdAt: { gte: moment().subtract(24, 'h').toDate() } },
      include: {
        box: true,
      },
    });
  }
}
