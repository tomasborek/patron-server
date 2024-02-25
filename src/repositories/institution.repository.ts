import {
  InstitutionCreate,
  InstitutionCreateStation,
  InstitutionGetMany,
} from '@/webserver/validators/institution.validator';
import IInstitutionRepository from './common/IInstitutionRepository';
import { PrismaClient } from '@prisma/client';
import { UserInstitutionRole } from '@/domain/entities/enums';
import moment from 'moment';

export default class InstitutionRepository implements IInstitutionRepository {
  constructor(private db: PrismaClient) {}
  create = (data: InstitutionCreate) => {
    return this.db.institution.create({
      data: { ...data },
    });
  };
  addUser = async (institutionId: string, userId: string, role: UserInstitutionRole, code: string) => {
    await this.db.userInstitution.create({
      data: { userId, institutionId, role, code },
    });
  };
  getMany = (query: InstitutionGetMany) => {
    return this.db.institution.findMany({
      where: {
        name: { contains: query.name },
      },
      skip: query.page ? (query.page - 1) * 10 : 0,
      take: 10,
    });
  };
  getStations = async (institutionId: string) => {
    const stations = await this.db.station.findMany({
      where: { institutionId },
      include: {
        boxes: {
          include: {
            reservations: {
              where: { cancelled: false, completed: false, createdAt: { gte: moment().subtract(24, 'h').toDate() } },
            },
          },
          orderBy: { localId: 'asc' },
        },
      },
    });

    return stations.map((station) => ({
      ...station,
      boxes: station.boxes.map((box) => ({
        id: box.id,
        localId: box.localId,
        stationId: box.stationId,
        deleted: box.deleted,
        createdAt: box.createdAt,
        state: box.state,
        reserved: !!box.reservations.length,
      })),
    }));
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
  getAllCodes = async (institutionId: string) => {
    return (await this.db.userInstitution.findMany({ where: { institutionId } })).map((ui) => ui.code);
  };
  createStation = async (data: InstitutionCreateStation, institutionId: string) => {
    return this.db.station.create({
      data: { name: data.name, institutionId },
    });
  };
  getAllForDev = () => {
    return this.db.institution.findMany();
  };
}
