import { BoxState, PrismaClient } from '@prisma/client';
import IBoxRepository from './common/IBoxRepository';
import moment from 'moment';

export default class BoxRepository implements IBoxRepository {
  constructor(private db: PrismaClient) {}

  create = async (stationId: string, localId: number) => {
    await this.db.box.create({
      data: { stationId, localId },
    });
  };
  getById = (id: string) => {
    return this.db.box.findUnique({ where: { id } });
  };

  changeState = async (id: string, state: BoxState) => {
    await this.db.box.update({
      where: { id },
      data: { state },
    });
  };
  canReserve = async (id: string, userId: string) => {
    return !!(await this.db.box.findUnique({
      where: { id, station: { institution: { users: { some: { userId } } } } },
    }));
  };
  isReserved = async (id: string) => {
    return !!(await this.db.reservation.findFirst({
      where: { boxId: id, cancelled: false, createdAt: { gte: moment().subtract(24, 'h').toDate() } },
    }));
  };
  createReservation = async (boxId: string, userId: string) => {
    await this.db.reservation.create({
      data: { boxId, userId },
    });
  };
}
