import { ICreateLogData } from '@/domain/entities/log';

interface ILogRepository {
  logAction(log: ICreateLogData): Promise<void>;
}

export default ILogRepository;
