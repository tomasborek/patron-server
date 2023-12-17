import { UserInstitutionRole } from '@/domain/entities/enums';
import IInstitution from '@/domain/entities/institution.entity';
import { InstitutionCreate } from '@/webserver/validators/institution.validator';

interface IInstitutionRepository {
  create: (data: InstitutionCreate) => Promise<IInstitution>;
  addUser: (
    institutionId: string,
    userId: string,
    role: UserInstitutionRole
  ) => Promise<void>;
  getById: (id: string) => Promise<IInstitution | null>;
  isAdmin: (userId: string, institutionId: string) => Promise<boolean>;
}

export default IInstitutionRepository;
