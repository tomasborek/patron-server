import { ILogDTO } from '@/domain/entities/log';
import { TLogGet } from '@/webserver/validators/log.validator';

interface ILogUsecase {
  get(query: TLogGet, userId: string): Promise<ILogDTO[]>;
}

export default ILogUsecase;
