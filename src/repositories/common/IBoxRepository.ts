import { IBox } from '@/domain/entities/box.entity';
import { BoxState } from '@/domain/entities/enums';

interface IBoxRepository {
  getById: (id: string) => Promise<IBox | null>;
  changeState: (id: string, state: BoxState) => Promise<void>;
  canReserve: (id: string, userId: string) => Promise<boolean>;
  create: (stationId: string, localId: number) => Promise<void>;
  createReservation: (boxId: string, userId: string) => Promise<void>;
  isReserved: (id: string) => Promise<boolean>;
}

export default IBoxRepository;
