import { PrismaClient } from '@prisma/client';
import { IStation } from '@/domain/entities/station.entity';
import { IBox, ISimpleBox } from '@/domain/entities/box.entity';

export interface IStationRepository {
  getById(id: string): Promise<IStation | null>;
  getEmptyBoxes(id: string): Promise<IBox[]>;
  getSimpleBoxes(id: string): Promise<ISimpleBox[]>;
}
export default class StationRepository implements IStationRepository {
  constructor(private db: PrismaClient) {}

  public getById(id: string) {
    return this.db.station.findUnique({ where: { id } });
  }
  public getEmptyBoxes(id: string) {
    return this.db.box.findMany({ where: { stationId: id, state: 'EMPTY' } });
  }
  public getSimpleBoxes(id: string) {
    return this.db.box.findMany({ where: { stationId: id }, select: { id: true, localId: true, state: true } });
  }
}
