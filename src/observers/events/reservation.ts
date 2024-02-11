import { IReservation, IReservationLogData } from '@/domain/entities/reservation.entity';

export interface IReservationCreatedEvent {
  event: 'reservation-created';
  data: {
    boxId: string;
    userId: string;
  };
}

export interface IReservationCancelledEvent {
  event: 'reservation-cancelled';
  data: {
    boxId: string;
    userId: string;
  };
}
