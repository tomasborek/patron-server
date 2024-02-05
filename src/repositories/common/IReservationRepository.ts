import { IReservation, IReservationLogData } from '@/domain/entities/reservation.entity';

interface IReservationRepository {
  getById: (id: string) => Promise<IReservation | null>;
  isActive: (id: string) => Promise<boolean>;
  getLogData: (id: string) => Promise<IReservationLogData | null>;
  cancel: (id: string) => Promise<void>;
}

export default IReservationRepository;
