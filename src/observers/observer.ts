import { IReservationCancelledEvent, IReservationCreatedEvent } from './events/reservation';
import { IUserAddedToInstitutionEvent, IUserActivatedEvent } from './events/user';

export type EventData =
  | IUserActivatedEvent
  | IUserAddedToInstitutionEvent
  | IReservationCancelledEvent
  | IReservationCreatedEvent;

export interface IObserver {
  update: (data: EventData) => void;
}
