import { IUserAddedToInstitutionEvent, IUserActivatedEvent } from './events/user';

export type EventData = IUserActivatedEvent | IUserAddedToInstitutionEvent;

export interface IObserver {
  update: (data: EventData) => void;
}
