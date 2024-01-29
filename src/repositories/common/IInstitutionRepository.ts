import { UserInstitutionRole } from '@/domain/entities/enums';
import { IInstitution } from '@/domain/entities/institution.entity';
import { IStation, IStationDTO } from '@/domain/entities/station.entity';
import { InstitutionCreate, InstitutionCreateStation } from '@/webserver/validators/institution.validator';
import { InstitutionGetMany } from '@/webserver/validators/institution.validator';

interface IInstitutionRepository {
  create: (data: InstitutionCreate) => Promise<IInstitution>;
  addUser: (institutionId: string, userId: string, role: UserInstitutionRole, code: string) => Promise<void>;
  getById: (id: string) => Promise<IInstitution | null>;
  getStations: (institutionId: string) => Promise<IStationDTO[]>;
  getMany: (query: InstitutionGetMany) => Promise<IInstitution[]>;
  isAdmin: (userId: string, institutionId: string) => Promise<boolean>;
  getAllCodes: (institutionId: string) => Promise<string[]>;
  createStation: (data: InstitutionCreateStation, institutionId: string) => Promise<IStation>;
}

export default IInstitutionRepository;
