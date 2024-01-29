import { IReservation } from '@/domain/entities/reservation.entity';

interface IReservationRepository {
  getById: (id: string) => Promise<IReservation | null>;
  isActive: (id: string) => Promise<boolean>;
  cancel: (id: string) => Promise<void>;
}

export default IReservationRepository;
