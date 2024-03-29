import {
  InstitutionCreate,
  InstitutionCreateStation,
  InstitutionGetMany,
} from '@/webserver/validators/institution.validator';
import { PrismaClient } from '@prisma/client';
import { UserInstitutionRole } from '@/domain/entities/enums';
import moment from 'moment';
import { IInstitutionUserDTO } from '@/domain/entities/user.entity';
import { IGetUsersQuery, IInstitution } from '@/domain/entities/institution.entity';
import { IStationDTO, IStation } from '@/domain/entities/station.entity';

export interface IInstitutionRepository {
  create: (data: InstitutionCreate) => Promise<IInstitution>;
  addUser: (institutionId: string, userId: string, role: UserInstitutionRole, code: string) => Promise<void>;
  removeUser: (institutionId: string, userId: string) => Promise<void>;
  getAllForDev: () => Promise<IInstitution[]>;
  getById: (id: string) => Promise<IInstitution | null>;
  getStations: (institutionId: string) => Promise<IStationDTO[]>;
  getMany: (query: InstitutionGetMany) => Promise<IInstitution[]>;
  isAdmin: (userId: string, institutionId: string) => Promise<boolean>;
  getAllCodes: (institutionId: string) => Promise<string[]>;
  createStation: (data: InstitutionCreateStation, institutionId: string) => Promise<IStation>;
  getUsers: (institutionId: string, query: IGetUsersQuery) => Promise<IInstitutionUserDTO[]>;
  countUsers: (institutionId: string) => Promise<number>;
}

export default class InstitutionRepository implements IInstitutionRepository {
  constructor(private db: PrismaClient) {}

  public create(data: InstitutionCreate) {
    return this.db.institution.create({
      data: { ...data },
    });
  }
  public async addUser(institutionId: string, userId: string, role: UserInstitutionRole, code: string) {
    await this.db.userInstitution.create({
      data: { userId, institutionId, role, code },
    });
  }
  public async removeUser(institutionId: string, userId: string) {
    await this.db.userInstitution.deleteMany({
      where: { userId, institutionId },
    });
  }
  public getMany(query: InstitutionGetMany) {
    return this.db.institution.findMany({
      where: {
        name: { contains: query.name },
      },
      skip: query.page ? (query.page - 1) * 10 : 0,
      take: 10,
    });
  }
  public async getStations(institutionId: string) {
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
  }
  public getById(id: string) {
    return this.db.institution.findUnique({ where: { id } });
  }
  public async isAdmin(userId: string, institutionId: string) {
    return (
      (
        await this.db.userInstitution.findMany({
          where: { userId, institutionId, role: 'ADMIN' },
        })
      ).length > 0
    );
  }
  public async getAllCodes(institutionId: string) {
    return (await this.db.userInstitution.findMany({ where: { institutionId } })).map((ui) => ui.code);
  }
  public createStation(data: InstitutionCreateStation, institutionId: string) {
    return this.db.station.create({
      data: { name: data.name, institutionId },
    });
  }
  public getAllForDev() {
    return this.db.institution.findMany();
  }
  public async getUsers(institutionId: string, query: IGetUsersQuery) {
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
  }
  public countUsers(institutionId: string) {
    return this.db.userInstitution.count({ where: { institutionId } });
  }
}
