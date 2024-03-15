import { IBoxRepository } from '@/repositories/';
import { ForbiddenError, NotFoundError } from '@/utils/errors';
import Publisher from '@/observers/publisher';
import { IReservationRepository } from '@/repositories';
import { IUserRepository } from '@/repositories';

export interface IBoxUsecase {
  createReservation: (boxId: string, userId: string) => Promise<void>;
}

export default class BoxUsecase extends Publisher implements IBoxUsecase {
  constructor(
    private boxRepository: IBoxRepository,
    private reservationRepository: IReservationRepository,
    private userRepository: IUserRepository,
  ) {
    super();
  }

  public async createReservation(boxId: string, userId: string) {
    const box = await this.boxRepository.getById(boxId);
    if (!box) throw new NotFoundError();
    if (!(await this.boxRepository.canReserve(box.id, userId))) throw new ForbiddenError('You cannot reserve this box');
    if ((await this.userRepository.getActiveReservations(userId)).find((r) => r.box.stationId === box.stationId))
      throw new ForbiddenError('You already have an active reservation');
    if (box.state !== 'DEFAULT') throw new ForbiddenError('Box is not available');
    if (await this.boxRepository.isReserved(box.id)) throw new ForbiddenError('Box is already reserved');
    const reservation = await this.boxRepository.createReservation(box.id, userId);
    const data = await this.reservationRepository.getLogData(reservation.id);
    if (data) {
      this.notify({
        event: 'reservation-created',
        data: {
          boxId: data.boxId,
          userId: data.userId,
        },
      });
    }
  }
}
