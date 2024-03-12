import { ICreateLogData, ILogDTO } from '@/domain/entities/log';
import { TLogGet } from '@/webserver/validators/log.validator';

interface ILogRepository {
  logAction(log: ICreateLogData): Promise<void>;
  get(query: TLogGet): Promise<ILogDTO[]>;
  count(query: TLogGet): Promise<number>;
}

export default ILogRepository;