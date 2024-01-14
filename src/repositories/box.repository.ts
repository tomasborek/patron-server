import { BoxState, PrismaClient } from '@prisma/client';
import IBoxRepository from './common/IBoxRepository';

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
}
