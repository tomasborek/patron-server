import IInstitutionRepository from '@/repositories/common/IListingRepository';
import IInstitutionUsecase from './common/IInstitutionUsecase';
import { InstitutionCreate } from '@/webserver/validators/institution.validator';
import { UserInstitutionRole } from '@/domain/entities/enums';
import { AlreadyExistsError, ForbiddenError } from '@/utils/errors';
import { NotFoundError } from '@/utils/errors';
import IUserRepository from '@/repositories/common/IUserRepository';
import Publisher from '@/observers/publisher';

export default class InstitutionUsecase
  extends Publisher
  implements IInstitutionUsecase
{
  constructor(
    private institutionRepository: IInstitutionRepository,
    private userRepository: IUserRepository
  ) {
    super();
  }

  create = async (data: InstitutionCreate) => {
    await this.institutionRepository.create(data);
  };
  addUser = async (
    institutionId: string,
    email: string,
    role: UserInstitutionRole,
    adminId: string
  ) => {
    const institution = await this.institutionRepository.getById(institutionId);
    if (!institution) throw new NotFoundError();
    if (!(await this.institutionRepository.isAdmin(adminId, institutionId)))
      throw new ForbiddenError();
    let existingUser;
    existingUser = await this.userRepository.getByEmail(email);
    if (!existingUser) {
      existingUser = await this.userRepository.create(
        email,
        institutionId,
        role
      );
    }
    if (
      await this.userRepository.isInInstitution(existingUser.id, institutionId)
    ) {
      throw new AlreadyExistsError('User already in institution');
    }
    await this.institutionRepository.addUser(
      existingUser.id,
      institutionId,
      role
    );
    this.notify({
      event: 'user-added-to-institution',
      data: { user: existingUser, institution },
    });
  };
}
