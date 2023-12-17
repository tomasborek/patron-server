import { InstitutionCreate } from '@/webserver/validators/institution.validator';
import IInstitutionRepository from './common/IListingRepository';
import { PrismaClient } from '@prisma/client';
import { UserInstitutionRole } from '@/domain/entities/enums';

export default class InstitutionRepository implements IInstitutionRepository {
  constructor(private db: PrismaClient) {}
  create = (data: InstitutionCreate) => {
    return this.db.institution.create({
      data: { ...data },
    });
  };
  addUser = async (
    institutionId: string,
    userId: string,
    role: UserInstitutionRole
  ) => {
    await this.db.userInstitution.create({
      data: { userId, institutionId, role },
    });
  };
  getById = (id: string) => {
    return this.db.institution.findUnique({ where: { id } });
  };
  isAdmin = async (userId: string, institutionId: string) => {
    return (
      (
        await this.db.userInstitution.findMany({
          where: { userId, institutionId, role: 'ADMIN' },
        })
      ).length > 0
    );
  };
}
