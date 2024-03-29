import { IBorrowedEvent, IReturnedEvent } from './events/box';
import { IReservationCancelledEvent, IReservationCreatedEvent } from './events/reservation';
import { IUserAddedToInstitutionEvent, IUserActivatedEvent, IUserRemovedFromInstitutionEvent } from './events/user';

export type EventData =
  | IUserActivatedEvent
  | IUserAddedToInstitutionEvent
  | IUserRemovedFromInstitutionEvent
  | IReservationCancelledEvent
  | IReservationCreatedEvent
  | IBorrowedEvent
  | IReturnedEvent;

export interface IObserver {
  update: (data: EventData) => void;
}
