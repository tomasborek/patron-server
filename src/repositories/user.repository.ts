import { PrismaClient } from '@prisma/client';
import { UserInstitutionRole } from '@/domain/entities/enums';
import { IBox } from '@/domain/entities/box.entity';
import { IMeDTO, IToken, IUser } from '@/domain/entities/user.entity';
import { IReservationWithBox, IUserReservationDTO } from '@/domain/entities/reservation.entity';

export interface IUserRepository {
  create: (email: string, institutionId: string, role: UserInstitutionRole, code: string) => Promise<IUser>;
  getById: (id: string) => Promise<IUser | null>;
  getMe: (id: string) => Promise<IMeDTO | null>;
  getByCode: (code: string, institutionId: string) => Promise<IUser | null>;
  getByEmail: (email: string) => Promise<IUser | null>;
  isInInstitution: (userId: string, institutionId: string) => Promise<boolean>;
  getPassword: (id: string) => Promise<string | null>;
  activate: (id: string, name: string, password: string) => Promise<void>;
  createToken: (id: string) => Promise<IToken>;
  getToken: (id: string) => Promise<IToken | null>;
  verify: (id: string) => Promise<void>;
  getActiveReservations: (id: string) => Promise<IReservationWithBox[]>;
  getReservations: (id: string) => Promise<IUserReservationDTO[]>;
  hasUnreturnedBorrow: (id: string, stationId: string) => Promise<boolean>;
  getActiveBorrowBox: (id: string, stationId: string) => Promise<IBox | null>;
}

export default class UserRepository implements IUserRepository {
  constructor(private db: PrismaClient) {}

  public create(email: string, institutionId: string, role: UserInstitutionRole, code: string) {
    return this.db.user.create({
      data: {
        email: email,
        userInstitutions: {
          create: { institutionId: institutionId, role, code },
        },
      },
    });
  }

  public async getById(id: string) {
    return this.db.user.findUnique({ where: { id } });
  }

  public async getMe(id: string) {
    const me = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userInstitutions: {
          select: {
            institution: { select: { id: true, name: true } },
            role: true,
            code: true,
          },
        },
      },
    });
    if (!me) return null;
    return {
      id: me.id,
      name: me.name!,
      email: me.email,
      role: me.role,
      institutions: me.userInstitutions.map((ui) => ({
        id: ui.institution.id,
        name: ui.institution.name,
        role: ui.role,
        code: ui.code,
      })),
    };
  }
  public async getByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  public async getByCode(code: string, institutionId: string) {
    const userInstitution = await this.db.userInstitution.findFirst({
      where: { code, institutionId },
      select: { user: true },
    });
    return userInstitution?.user ?? null;
  }

  public async isInInstitution(userId: string, institutionId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: { userInstitutions: true },
    });
    if (!user) return false;
    return user.userInstitutions.some((ui) => ui.institutionId === institutionId);
  }

  public async getPassword(id: string) {
    return (
      (
        await this.db.user.findUnique({
          where: { id },
          select: { password: true },
        })
      )?.password ?? null
    );
  }

  public async activate(id: string, name: string, password: string) {
    await this.db.user.update({
      where: { id },
      data: { active: true, password, name },
    });
  }

  public async createToken(id: string) {
    const token = Math.floor(100000 + Math.random() * 900000);
    return this.db.verificationToken.create({
      data: { token, userId: id },
    });
  }

  public async getToken(id: string) {
    return this.db.verificationToken.findUnique({
      where: { id },
    });
  }

  public async verify(id: string) {
    await this.db.user.update({
      where: { id },
      data: { verified: true },
    });
  }

  public async getActiveReservations(userId: string) {
    return this.db.reservation.findMany({
      where: {
        userId,
        cancelled: false,
        completed: false,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      include: { box: true },
    });
  }

  public async getReservations(userId: string) {
    const reservations = await this.db.reservation.findMany({
      where: {
        userId,
        cancelled: false,
        completed: false,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      select: {
        id: true,
        createdAt: true,
        box: {
          select: {
            id: true,
            localId: true,
            station: {
              select: {
                id: true,
                name: true,
                institution: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return reservations.map((r) => ({
      id: r.id,
      createdAt: r.createdAt,
      institution: {
        id: r.box.station.institution.id,
        name: r.box.station.institution.name,
      },
      station: {
        id: r.box.station.id,
        name: r.box.station.name,
        box: {
          id: r.box.id,
          localId: r.box.localId,
        },
      },
    }));
  }

  public async hasUnreturnedBorrow(id: string, stationId: string) {
    const newsetBorrow = await this.db.log.findFirst({
      where: { userId: id, stationId, action: 'BORROW' },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    const newestReturn = await this.db.log.findFirst({
      where: { userId: id, stationId, action: 'RETURN' },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    if (!newsetBorrow) return false;
    if (!newestReturn && newsetBorrow) return true;
    if (!newestReturn && !newsetBorrow) return false;
    return newsetBorrow.createdAt > newestReturn!.createdAt;
  }
  public async getActiveBorrowBox(id: string, stationId: string) {
    const borrow = await this.db.log.findFirst({
      where: { userId: id, stationId, action: 'BORROW' },
      orderBy: { createdAt: 'desc' },
      take: 1,
      include: { box: true },
    });
    return borrow?.box ?? null;
  }
}
