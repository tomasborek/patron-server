import { PrismaClient } from '@prisma/client';
import IStationRepository from './common/IStationRepository';
import { ISimpleBox } from '@/domain/entities/box.entity';

export default class StationRepository implements IStationRepository {
  constructor(private db: PrismaClient) {}

  getById = (id: string) => {
    return this.db.station.findUnique({ where: { id } });
  };
  getEmptyBoxes = (id: string) => {
    return this.db.box.findMany({ where: { stationId: id, state: 'EMPTY' } });
  };
  getSimpleBoxes = (id: string) => {
    return this.db.box.findMany({ where: { stationId: id }, select: { id: true, localId: true, state: true } });
  };
}
