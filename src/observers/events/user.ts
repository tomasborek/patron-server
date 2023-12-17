import IInstitution from '@/domain/entities/institution.entity';
import { IUser } from '@/domain/entities/user.entity';

export interface IUserActivated {
  event: 'user-activated';
  data: {
    user: IUser;
  };
}

export interface IUserAddedToInstitutionEvent {
  event: 'user-added-to-institution';
  data: {
    user: IUser;
    institution: IInstitution;
  };
}
