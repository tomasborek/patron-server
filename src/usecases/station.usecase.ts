import { IStationRepository } from '@/repositories';
import { BadRequestError, NotFoundError } from '@/utils/errors';
import { IUserRepository } from '@/repositories';
import { IReservationRepository } from '@/repositories';
import { IBoxRepository } from '@/repositories';
import Publisher from '@/observers/publisher';
import { ISimpleBox } from '@/domain/entities/box.entity';

interface IStationUsecase {
  getBoxForReturn(id: string, code: string): Promise<number>; //number for localId
  getBoxForReservation(id: string, code: string): Promise<number>;
  getBoxesStatus(id: string): Promise<ISimpleBox[]>;
  borrow(id: string, code: string, boxId: string): Promise<number>;
}

export default class StationUsecase extends Publisher implements IStationUsecase {
  constructor(
    private stationRepository: IStationRepository,
    private userRepository: IUserRepository,
    private reservationRepository: IReservationRepository,
    private boxRepository: IBoxRepository,
  ) {
    super();
  }

  public async getBoxForReturn(id: string, code: string) {
    const station = await this.stationRepository.getById(id);
    if (!station) throw new NotFoundError('Station not found');
    const user = await this.userRepository.getByCode(code, station.institutionId);
    if (!user) throw new NotFoundError('User not found');
    if (!(await this.userRepository.hasUnreturnedBorrow(user.id, station.id)))
      throw new BadRequestError('No unreturned borrow found');
    const box = await this.userRepository.getActiveBorrowBox(user.id, station.id);
    if (!box) throw new NotFoundError('No active borrow found');
    this.boxRepository.resetToDefault(box.id);
    this.notify({ event: 'returned', data: { boxId: box.id, userId: user.id } });
    return box.localId;
  }
  public async getBoxForReservation(id: string, code: string) {
    const station = await this.stationRepository.getById(id);
    if (!station) throw new NotFoundError('Station not found');
    const user = await this.userRepository.getByCode(code, station.institutionId);
    if (!user) throw new NotFoundError('User not found');
    const reservation = await this.reservationRepository.getByUserId(user.id);
    if (!reservation) throw new NotFoundError('No reservation found');
    if (reservation.box.stationId !== id) throw new BadRequestError('Reservation not for this station');
    await this.reservationRepository.complete(reservation.id); //TODO: move into observer
    await this.boxRepository.empty(reservation.boxId);
    this.notify({ event: 'borrowed', data: { boxId: reservation.boxId, userId: user.id } });
    return reservation.box.localId;
  }
  public async getBoxesStatus(id: string) {
    const institutionName = id.split(':')[0];
    const stationName = id.split(':')[1];
    const boxes = await this.stationRepository.getSimpleBoxes(institutionName, stationName);
    return boxes;
  }
  public async borrow(id: string, code: string, boxId: string) {
    const station = await this.stationRepository.getById(id);
    if (!station) throw new NotFoundError('Station not found');
    const user = await this.userRepository.getByCode(code, station.institutionId);
    if (!user) throw new NotFoundError('User not found');
    const box = await this.boxRepository.getById(boxId);
    if (!box) throw new NotFoundError('Box not found');
    if (box.state !== 'DEFAULT') throw new BadRequestError('Box is not available');
    if (await this.userRepository.hasUnreturnedBorrow(user.id, station.id))
      throw new BadRequestError('User has unreturned borrow');
    this.notify({ event: 'borrowed', data: { boxId: box.id, userId: user.id } });
    await this.boxRepository.empty(box.id);
    return box.localId;
  }
}
