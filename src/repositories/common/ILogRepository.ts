import { ICreateLogData, ILog } from '@/domain/entities/log';
import { TLogGet } from '@/webserver/validators/log.validator';

interface ILogRepository {
  logAction(log: ICreateLogData): Promise<void>;
  get(query: TLogGet): Promise<ILog[]>;
}

export default ILogRepository;
