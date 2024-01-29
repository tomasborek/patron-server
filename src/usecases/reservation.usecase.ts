import IReservationRepository from '@/repositories/common/IReservationRepository';
import IReservationUsecase from './common/IReservationUsecase';
import { BadRequestError, ForbiddenError, NotFoundError } from '@/utils/errors';

export default class ReservationUsecase implements IReservationUsecase {
  constructor(private reservationRepository: IReservationRepository) {}

  cancel = async (id: string, userId: string) => {
    const reservation = await this.reservationRepository.getById(id);
    if (!reservation) throw new NotFoundError();
    if (reservation.userId !== userId) throw new ForbiddenError('You cannot cancel this reservation');
    if (!(await this.reservationRepository.isActive(id)))
      throw new BadRequestError('You cannot cancel this reservation');
    await this.reservationRepository.cancel(id);
  };
}
