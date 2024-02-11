import { IBox, IExtendedBox } from '@/domain/entities/box.entity';
import { BoxState } from '@/domain/entities/enums';
import { IReservation } from '@/domain/entities/reservation.entity';

interface IBoxRepository {
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

export default IBoxRepository;
