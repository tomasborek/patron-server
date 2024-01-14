import IUserRepository from '@/repositories/common/IUserRepository';
import { EventData, IObserver } from './observer';

export default class EmailObserver implements IObserver {
  constructor(private userRepsoitory: IUserRepository) {}
  update = async (data: EventData) => {
    if (data.event === 'user-activated') {
        const token = await this.userRepsoitory.createToken(data.data.user.id);
        console.log('Simulating email sending...');
        console.log(`To finish your activation enter the code below: ${token}`);
        console.log(`Email sent to ${data.data.user.email}`);
    }
      else if(data.event === 'user-added-to-institution'){
        console.log('Simulating email sending...');
        console.log(
          `You have been added to institution ${data.data.institution.name}`
        );
        console.log(`Email sent to ${data.data.user.email}`);
       }
  };
}
