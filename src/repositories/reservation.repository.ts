import { PrismaClient } from '@prisma/client';
import IReservationRepository from './common/IReservationRepository';
import moment from 'moment';

export default class ReservationRepository implements IReservationRepository {
  constructor(private db: PrismaClient) {}

  getById = (id: string) => {
    return this.db.reservation.findUnique({ where: { id } });
  };

  isActive = async (id: string) => {
    return !!(await this.db.reservation.findUnique({
      where: { id, cancelled: false, createdAt: { gte: moment().subtract(24, 'h').toDate() } },
    }));
  };
  getLogData = async (id: string) => {
    return this.db.reservation.findUnique({
      where: { id },
      include: {
        box: { select: { id: true, station: { select: { id: true, institution: { select: { id: true } } } } } },
      },
    });
  };
  cancel = async (id: string) => {
    await this.db.reservation.update({
      where: { id },
      data: { cancelled: true, cancelledAt: new Date() },
    });
  };
}
