import {
  InstitutionCreate,
  InstitutionCreateStation,
  InstitutionGetMany,
} from '@/webserver/validators/institution.validator';
import IInstitutionRepository from './common/IInstitutionRepository';
import { PrismaClient } from '@prisma/client';
import { UserInstitutionRole } from '@/domain/entities/enums';
import moment from 'moment';
import { IInstitutionUserDTO } from '@/domain/entities/user.entity';
import { IGetUsersQuery } from '@/domain/entities/institution.entity';

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
  getUsers = async (institutionId: string, query: IGetUsersQuery) => {
    const user = await this.db.user.findMany({
      where: { userInstitutions: { some: { institutionId } } },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
        active: true,
        createdAt: true,
        role: true,
        userInstitutions: {
          where: { institutionId },
          select: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      skip: query.page ? (Number(query.page) - 1) * 5 : 0,
    });
    return user.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      verified: u.verified,
      active: u.active,
      createdAt: u.createdAt,
      role: u.role,
      institutionRole: u.userInstitutions[0].role,
    }));
  };
  countUsers = async (institutionId: string) => {
    return this.db.userInstitution.count({ where: { institutionId } });
  };
}
