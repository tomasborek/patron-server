import IUserRepository from '@/repositories/common/IUserRepository';
import { EventData, IObserver } from './observer';
import { IUserActivatedEvent, IUserAddedToInstitutionEvent } from './events/user';

export default class EmailObserver implements IObserver {
  constructor(private userRepsoitory: IUserRepository) {}

  update = async (data: EventData) => {
    console.log('sumulating email sending...');
    if (data.event === 'user-activated') {
      await this.userActivated(data);
    } else if (data.event === 'user-added-to-institution') {
      await this.userAddedToInstitution(data);
    }
  };

  private userActivated = async (data: IUserActivatedEvent) => {
    console.log(`To finish your activation enter the code below: ${data.data.token}`);
    console.log(`Email sent to ${data.data.user.email}`);
  };

  private userAddedToInstitution = async (data: IUserAddedToInstitutionEvent) => {
    console.log(`You have been added to institution ${data.data.institution.name}`);
    console.log(`Email sent to ${data.data.user.email}`);
  };
}
