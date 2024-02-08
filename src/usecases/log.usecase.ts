import ILogRepository from '@/repositories/common/ILogRepository';
import ILogUsecase from './common/IlogUsecase';
import { TLogGet } from '@/webserver/validators/log.validator';
import { ForbiddenError } from '@/utils/errors';
import IInstitutionRepository from '@/repositories/common/IInstitutionRepository';

export default class LogUsecase implements ILogUsecase {
  constructor(private logRepository: ILogRepository, private institutionRepository: IInstitutionRepository) {}

  get = async (query: TLogGet, userId: string) => {
    if (query.userId) {
      if (query.userId !== userId) {
        throw new ForbiddenError('Unauthorized');
      }
    }
    if (query.institutionId) {
      if (!(await this.institutionRepository.isAdmin(userId, query.institutionId))) {
        throw new ForbiddenError('Unauthorized');
      }
    }
    return this.logRepository.get(query);
  };
}
