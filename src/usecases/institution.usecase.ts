import { InstitutionCreate, InstitutionCreateStation } from '@/webserver/validators/institution.validator';
import { UserInstitutionRole } from '@/domain/entities/enums';
import { AlreadyExistsError, BadRequestError, ForbiddenError } from '@/utils/errors';
import { NotFoundError } from '@/utils/errors';
import { IInstitutionRepository, IUserRepository } from '@/repositories';
import Publisher from '@/observers/publisher';
import { IBoxRepository } from '@/repositories/box.repository';
import { IStation } from '@/domain/entities/station.entity';
import { IInstitutionUserDTO } from '@/domain/entities/user.entity';
import { IGetUsersQuery } from '@/domain/entities/institution.entity';

export interface IInstitutionUsecase {
  create: (data: InstitutionCreate) => Promise<void>;
  addUser: (institutionId: string, email: string, role: string, adminId: string) => Promise<void>;
  removeUser: (institutionId: string, userId: string, adminId: string) => Promise<void>;
  getStations: (institutionId: string, userId: string) => Promise<IStation[]>;
  generateCode: (institutionId: string) => Promise<string>;
  createStation: (data: InstitutionCreateStation, institutionId: string) => Promise<void>;
  getUsers: (
    institutionId: string,
    userId: string,
    query: IGetUsersQuery,
  ) => Promise<{ users: IInstitutionUserDTO[]; count: number }>;
}

export default class InstitutionUsecase extends Publisher implements IInstitutionUsecase {
  constructor(
    private institutionRepository: IInstitutionRepository,
    private userRepository: IUserRepository,
    private boxRepository: IBoxRepository,
  ) {
    super();
  }

  public async create(data: InstitutionCreate) {
    await this.institutionRepository.create(data);
  }

  public async addUser(institutionId: string, email: string, role: UserInstitutionRole, adminId: string) {
    const institution = await this.institutionRepository.getById(institutionId);
    if (!institution) throw new NotFoundError('Institution not found');
    const admin = await this.userRepository.getById(adminId);
    if (!admin) throw new NotFoundError('Admin not found');
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
  }

  public async removeUser(institutionId: string, userId: string, adminId: string) {
    const institution = await this.institutionRepository.getById(institutionId);
    const user = await this.userRepository.getById(userId);
    const admin = await this.userRepository.getById(adminId);
    if (!user) throw new NotFoundError('User not found');
    if (!institution) throw new NotFoundError('Institution not found');
    if (!(await this.institutionRepository.isAdmin(adminId, institutionId)) && admin!.role !== 'DEVELOPER')
      throw new ForbiddenError('Forbidden');
    if (!(await this.userRepository.isInInstitution(userId, institutionId)))
      throw new BadRequestError('User not in institution');
    await this.institutionRepository.removeUser(institutionId, userId);

    this.notify({
      event: 'user-removed-from-institution',
      data: { user, institution },
    });
  }

  public async getStations(institutionId: string, userId: string) {
    const institution = await this.institutionRepository.getById(institutionId);
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundError('User not found');
    if (!institution) throw new NotFoundError('Institution not found');
    if (!(await this.userRepository.isInInstitution(userId, institutionId)) && user.role !== 'DEVELOPER')
      throw new ForbiddenError();
    return this.institutionRepository.getStations(institutionId);
  }

  public async generateCode(institutionId: string) {
    const codes = await this.institutionRepository.getAllCodes(institutionId);
    let code;
    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (codes.includes(code));
    return code;
  }

  public async createStation(data: InstitutionCreateStation, institutionId: string) {
    const station = await this.institutionRepository.createStation(data, institutionId);
    for (let i = 0; i < data.boxesCount; i++) {
      await this.boxRepository.create(station.id, i + 1);
    }
  }

  public async getUsers(institutionId: string, userId: string, query: IGetUsersQuery) {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundError('User not found');
    if (user.role !== 'DEVELOPER' && !(await this.institutionRepository.isAdmin(userId, institutionId)))
      throw new ForbiddenError('Forbidden');

    return {
      users: await this.institutionRepository.getUsers(institutionId, query),
      count: await this.institutionRepository.countUsers(institutionId),
    };
  }
}
