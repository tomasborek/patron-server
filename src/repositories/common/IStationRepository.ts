import { IBox, ISimpleBox } from '@/domain/entities/box.entity';
import { IStation } from '@/domain/entities/station.entity';

interface IStationRepository {
  getById(id: string): Promise<IStation | null>;
  getEmptyBoxes(id: string): Promise<IBox[]>;
  getSimpleBoxes(id: string): Promise<ISimpleBox[]>;
}

export default IStationRepository;
