import ILogRepository from '@/repositories/common/ILogRepository';
import { EventData, IObserver } from './observer';

export default class LogObserver implements IObserver {
  constructor(private logRepository: ILogRepository) {}
  update = async (data: EventData) => {
    if (data.event === 'user-activated') {
      await this.logRepository.logAction({ userId: data.data.user.id, action: 'ACTIVATE' });
    }
    if (data.event === 'user-added-to-institution') {
      await this.logRepository.logAction({
        userId: data.data.user.id,
        institutionId: data.data.institution.id,
        action: 'ADD',
      });
    }
    if (data.event === 'reservation-created') {
      console.log('im runnin');
      await this.logRepository.logAction({
        userId: data.data.userId,
        boxId: data.data.boxId,
        stationId: data.data.box.station.id,
        institutionId: data.data.box.station.institution.id,
        action: 'RESERVATIONCREATE',
      });
    }
    if (data.event === 'reservation-cancelled') {
      await this.logRepository.logAction({
        userId: data.data.userId,
        boxId: data.data.boxId,
        stationId: data.data.box.station.id,
        institutionId: data.data.box.station.institution.id,
        action: 'RESERVATIONCANCEL',
      });
    }
  };
}
