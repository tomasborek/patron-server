import { IReservation, IReservationLogData } from '@/domain/entities/reservation.entity';

export interface IReservationCreatedEvent {
  event: 'reservation-created';
  data: IReservationLogData;
}

export interface IReservationCancelledEvent {
  event: 'reservation-cancelled';
  data: IReservationLogData;
}
