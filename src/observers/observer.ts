import { IUserAddedToInstitutionEvent, IUserActivated } from './events/user';

export type EventData = IUserActivated | IUserAddedToInstitutionEvent;

export interface IObserver {
  update: (data: EventData) => void;
}
