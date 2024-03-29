import { IInstitution } from '@/domain/entities/institution.entity';
import { IUser } from '@/domain/entities/user.entity';

export interface IUserActivatedEvent {
  event: 'user-activated';
  data: {
    user: IUser;
    token: number;
  };
}

export interface IUserAddedToInstitutionEvent {
  event: 'user-added-to-institution';
  data: {
    user: IUser;
    institution: IInstitution;
  };
}

export interface IUserRemovedFromInstitutionEvent {
  event: 'user-removed-from-institution';
  data: {
    user: IUser;
    institution: IInstitution;
  };
}
