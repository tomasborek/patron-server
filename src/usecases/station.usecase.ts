import IStationRepository from '@/repositories/common/IStationRepository';
import IStationUsecase from './common/IStationUsecase';
import { BadRequestError, NotFoundError } from '@/utils/errors';
import IUserRepository from '@/repositories/common/IUserRepository';
import IReservationRepository from '@/repositories/common/IReservationRepository';
import IBoxRepository from '@/repositories/common/IBoxRepository';

export default class StationUsecase implements IStationUsecase {
  constructor(
    private stationRepository: IStationRepository,
    private userRepository: IUserRepository,
    private reservationRepository: IReservationRepository,
    private boxRepository: IBoxRepository,
  ) {}
  getBoxForReturn = async (id: string, code: string) => {
    const station = await this.stationRepository.getById(id);
    if (!station) throw new NotFoundError('Station not found');
    const user = await this.userRepository.getByCode(code, station.institutionId);
    if (!user) throw new NotFoundError('User not found');
    const boxes = await this.stationRepository.getEmptyBoxes(id);
    if (boxes.length === 0) throw new BadRequestError('No empty boxes');
    await this.boxRepository.resetToDefault(boxes[0].id);
    return boxes[0].localId;
  };
  getBoxForReservation = async (id: string, code: string) => {
    const station = await this.stationRepository.getById(id);
    if (!station) throw new NotFoundError('Station not found');
    const user = await this.userRepository.getByCode(code, station.institutionId);
    if (!user) throw new NotFoundError('User not found');
    const reservation = await this.reservationRepository.getByUserId(user.id);
    if (!reservation) throw new NotFoundError('No reservation found');
    await this.reservationRepository.complete(reservation.id); //TODO: move into observer
    await this.boxRepository.empty(reservation.boxId);
    return reservation.box.localId;
  };
  getBoxesStatus = async (id: string) => {
    const boxes = await this.stationRepository.getSimpleBoxes(id);
    return boxes;
  };
  borrow = async (id: string, code: string) => {
    //just log
  };
}
