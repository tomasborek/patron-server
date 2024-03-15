import { IReservationRepository } from '@/repositories';
import { BadRequestError, ForbiddenError, NotFoundError } from '@/utils/errors';
import Publisher from '@/observers/publisher';

export interface IReservationUsecase {
  cancel: (id: string, userId: string) => Promise<void>;
}

export default class ReservationUsecase extends Publisher implements IReservationUsecase {
  constructor(private reservationRepository: IReservationRepository) {
    super();
  }

  public cancel = async (id: string, userId: string) => {
    const reservation = await this.reservationRepository.getById(id);
    if (!reservation) throw new NotFoundError();
    if (reservation.userId !== userId) throw new ForbiddenError('You cannot cancel this reservation');
    if (!(await this.reservationRepository.isActive(id)))
      throw new BadRequestError('You cannot cancel this reservation');
    await this.reservationRepository.cancel(id);
    const data = await this.reservationRepository.getLogData(id);
    if (data) {
      this.notify({
        event: 'reservation-cancelled',
        data: {
          boxId: data.boxId,
          userId: data.userId,
        },
      });
    }
  };
}
