import IInstitutionRepository from '@/repositories/common/IInstitutionRepository';
import IInstitutionUsecase from './common/IInstitutionUsecase';
import { InstitutionCreate, InstitutionCreateStation } from '@/webserver/validators/institution.validator';
import { UserInstitutionRole } from '@/domain/entities/enums';
import { AlreadyExistsError, ForbiddenError } from '@/utils/errors';
import { NotFoundError } from '@/utils/errors';
import IUserRepository from '@/repositories/common/IUserRepository';
import Publisher from '@/observers/publisher';
import IBoxRepository from '@/repositories/common/IBoxRepository';

export default class InstitutionUsecase extends Publisher implements IInstitutionUsecase {
  constructor(
    private institutionRepository: IInstitutionRepository,
    private userRepository: IUserRepository,
    private boxRepository: IBoxRepository,
  ) {
    super();
  }

  create = async (data: InstitutionCreate) => {
    await this.institutionRepository.create(data);
  };
  addUser = async (institutionId: string, email: string, role: UserInstitutionRole, adminId: string) => {
    const institution = await this.institutionRepository.getById(institutionId);
    if (!institution) throw new NotFoundError();
    const admin = await this.userRepository.getById(adminId);
    if (!admin) throw new NotFoundError();
    if (!(await this.institutionRepository.isAdmin(admin.id, institutionId)) && admin.role !== 'DEVELOPER')
      throw new ForbiddenError();
    let existingUser;
    existingUser = await this.userRepository.getByEmail(email);
    if (await this.userRepository.isInInstitution(existingUser?.id || '', institutionId)) {
      throw new AlreadyExistsError('User already in institution');
    }
    const code = await this.generateCode(institutionId);
    if (!existingUser) {
      existingUser = await this.userRepository.create(email, institutionId, role, code);
    } else {
      await this.institutionRepository.addUser(existingUser.id, institutionId, role, code);
    }
    this.notify({
      event: 'user-added-to-institution',
      data: { user: existingUser, institution },
    });
  };
  generateCode = async (institutionId: string) => {
    const codes = await this.institutionRepository.getAllCodes(institutionId);
    let code;
    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (codes.includes(code));
    return code;
  };
  createStation = async (data: InstitutionCreateStation, institutionId: string) => {
    const station = await this.institutionRepository.createStation(data, institutionId);
    for (let i = 0; i < data.boxesCount; i++) {
      await this.boxRepository.create(station.id, i + 1);
    }
  };
}
