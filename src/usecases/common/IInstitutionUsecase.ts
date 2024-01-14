import { InstitutionCreate, InstitutionCreateStation } from '@/webserver/validators/institution.validator';

interface IInstitutionUsecase {
  create: (data: InstitutionCreate) => Promise<void>;
  // getMany: (query: InstitutionGetMany) => Promise<void>;
  addUser: (institutionId: string, email: string, role: string, adminId: string) => Promise<void>;
  generateCode: (institutionId: string) => Promise<string>;
  createStation: (data: InstitutionCreateStation, institutionId: string) => Promise<void>;
}

export default IInstitutionUsecase;