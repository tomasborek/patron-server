import { IReservation, IReservationLogData, IReservationWithBox } from '@/domain/entities/reservation.entity';

interface IReservationRepository {
  getById: (id: string) => Promise<IReservation | null>;
  isActive: (id: string) => Promise<boolean>;
  getLogData: (id: string) => Promise<IReservationLogData | null>;
  cancel: (id: string) => Promise<void>;
  complete: (id: string) => Promise<void>;
  getByUserId: (userId: string) => Promise<IReservationWithBox | null>;
}

export default IReservationRepository;
