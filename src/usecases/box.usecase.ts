import IBoxRepository from '@/repositories/common/IBoxRepository';
import IBoxUsecase from './common/IBoxUsecase';
import { ForbiddenError, NotFoundError } from '@/utils/errors';

export default class BoxUsecase implements IBoxUsecase {
  constructor(private boxRepository: IBoxRepository) {}

  createReservation = async (boxId: string, userId: string) => {
    const box = await this.boxRepository.getById(boxId);
    if (!box) throw new NotFoundError();
    if (!(await this.boxRepository.canReserve(box.id, userId))) throw new ForbiddenError('You cannot reserve this box');
    if (box.state !== 'DEFAULT') throw new ForbiddenError('Box is not available');
    if (await this.boxRepository.isReserved(box.id)) throw new ForbiddenError('Box is already reserved');
    await this.boxRepository.createReservation(box.id, userId);
  };
}
