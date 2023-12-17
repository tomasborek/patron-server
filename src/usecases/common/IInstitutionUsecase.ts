import { InstitutionCreate } from '@/webserver/validators/institution.validator';

interface IInstitutionUsecase {
  create: (data: InstitutionCreate) => Promise<void>;
  addUser: (
    institutionId: string,
    email: string,
    role: string,
    adminId: string
  ) => Promise<void>;
}

export default IInstitutionUsecase;
