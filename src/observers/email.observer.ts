import IUserRepository from '@/repositories/common/IUserRepository';
import { EventData, IObserver } from './observer';
import { IUserActivatedEvent, IUserAddedToInstitutionEvent } from './events/user';
import { IMailer } from '@/webserver/mail/mailer';

export default class EmailObserver implements IObserver {
  constructor(private userRepsoitory: IUserRepository, private mailer: IMailer) {}

  update = async (data: EventData) => {
    if (data.event === 'user-activated') {
      await this.userActivated(data);
    } else if (data.event === 'user-added-to-institution') {
      await this.userAddedToInstitution(data);
    }
  };

  private userActivated = async (data: IUserActivatedEvent) => {
    await this.mailer.sendEmail(
      data.data.user.email,
      'Activation code | PatronBox',
      `Dear user, to finish your activation enter the code below: <h1>${data.data.token}</h1> If you didn't request this, please ignore this email. If you lost the link, go to https://patronbox.cz/activate?id=${data.data.token}`,
    );
  };

  private userAddedToInstitution = async (data: IUserAddedToInstitutionEvent) => {
    await this.mailer.sendEmail(
      data.data.user.email,
      'You have been added to institution | PatronBox',
      `Dear user, you have been added to institution ${data.data.institution.name}, to activate your account please go to https://patronbox.cz/activate and enter this email.`,
    );
  };
}
