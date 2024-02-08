import { IStation } from '@/domain/entities/station.entity';

interface IStationUsecase {
  getBoxForReturn(id: string, code: string): Promise<number>; //number for localId
}

export default IStationUsecase;
