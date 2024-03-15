import { ILogRepository } from '@/repositories';
import { TLogGet } from '@/webserver/validators/log.validator';
import { ForbiddenError, NotFoundError } from '@/utils/errors';
import { IInstitutionRepository } from '@/repositories';
import { IUserRepository } from '@/repositories';
import { ILogsDTO } from '@/domain/entities/log';

export interface ILogUsecase {
  get(query: TLogGet, userId: string): Promise<ILogsDTO>;
}

export default class LogUsecase implements ILogUsecase {
  constructor(
    private logRepository: ILogRepository,
    private institutionRepository: IInstitutionRepository,
    private userRepository: IUserRepository,
  ) {}

  public async get(query: TLogGet, userId: string) {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.role === 'USER') {
      // no user can search for logs in another institution that he is not part of
      if (!query.institutionId) {
        throw new ForbiddenError('Forbidden');
      }
      if (!(await this.userRepository.isInInstitution(userId, query.institutionId))) {
        throw new ForbiddenError('Forbidden');
      }

      const isAdmin = await this.institutionRepository.isAdmin(userId, query.institutionId);

      if (isAdmin) {
        if (query.userId && !(await this.userRepository.isInInstitution(query.userId, query.institutionId))) {
          throw new ForbiddenError('Forbidden');
        }
      } else {
        if (!query.userId || query.userId !== userId) {
          throw new ForbiddenError('Forbidden');
        }
      }
    }
    const logs = await this.logRepository.get(query);
    const count = await this.logRepository.count(query);
    return { logs, count };
  }
}
