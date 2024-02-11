import ILogRepository from '@/repositories/common/ILogRepository';
import { EventData, IObserver } from './observer';
import IBoxRepository from '@/repositories/common/IBoxRepository';

export default class LogObserver implements IObserver {
  constructor(private logRepository: ILogRepository, private boxRepository: IBoxRepository) {}
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
      const box = await this.boxRepository.getExtended(data.data.boxId);
      if (!box) throw new Error('Box not found');
      await this.logRepository.logAction({
        userId: data.data.userId,
        boxId: data.data.boxId,
        stationId: box.station.id,
        institutionId: box.station.institution.id,
        action: 'RESERVATIONCREATE',
      });
    }
    if (data.event === 'reservation-cancelled') {
      const box = await this.boxRepository.getExtended(data.data.boxId);
      if (!box) throw new Error('Box not found');
      await this.logRepository.logAction({
        userId: data.data.userId,
        boxId: box.id,
        stationId: box.station.id,
        institutionId: box.station.institution.id,
        action: 'RESERVATIONCANCEL',
      });
    }
    if (data.event === 'borrowed') {
      console.log('someone borrow soemthing');
      const box = await this.boxRepository.getExtended(data.data.boxId);
      if (!box) throw new Error('Box not found');
      await this.logRepository.logAction({
        userId: data.data.userId,
        boxId: box.id,
        stationId: box.station.id,
        institutionId: box.station.institution.id,
        action: 'BORROW',
      });
    }
    if (data.event === 'returned') {
      const box = await this.boxRepository.getExtended(data.data.boxId);
      if (!box) throw new Error('Box not found');
      await this.logRepository.logAction({
        userId: data.data.userId,
        boxId: box.id,
        stationId: box.station.id,
        institutionId: box.station.institution.id,
        action: 'RETURN',
      });
    }
  };
}
