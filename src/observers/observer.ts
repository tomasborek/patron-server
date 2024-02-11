import { IBorrowedEvent, IReturnedEvent } from './events/box';
import { IReservationCancelledEvent, IReservationCreatedEvent } from './events/reservation';
import { IUserAddedToInstitutionEvent, IUserActivatedEvent } from './events/user';

export type EventData =
  | IUserActivatedEvent
  | IUserAddedToInstitutionEvent
  | IReservationCancelledEvent
  | IReservationCreatedEvent
  | IBorrowedEvent
  | IReturnedEvent;

export interface IObserver {
  update: (data: EventData) => void;
}
