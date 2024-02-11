import { PrismaClient } from '@prisma/client';
import IUserRepository from './common/IUserRepository';
import { UserInstitutionRole } from '@/domain/entities/enums';
import { IBox } from '@/domain/entities/box.entity';

export default class UserRepository implements IUserRepository {
  constructor(private db: PrismaClient) {}
  create = (email: string, institutionId: string, role: UserInstitutionRole, code: string) => {
    return this.db.user.create({
      data: {
        email: email,
        userInstitutions: {
          create: { institutionId: institutionId, role, code },
        },
      },
    });
  };

  getById = (id: string) => {
    return this.db.user.findUnique({ where: { id } });
  };

  getMe = async (id: string) => {
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
  };
  getByEmail = (email: string) => {
    return this.db.user.findUnique({ where: { email } });
  };

  getByCode = (code: string, institutionId: string) => {
    return this.db.userInstitution
      .findFirst({
        where: { code, institutionId },
      })
      ?.user();
  };

  isInInstitution = async (userId: string, institutionId: string) => {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: { userInstitutions: true },
    });
    if (!user) return false;
    return user.userInstitutions.some((ui) => ui.institutionId === institutionId);
  };

  getPassword = async (id: string) => {
    return (
      (
        await this.db.user.findUnique({
          where: { id },
          select: { password: true },
        })
      )?.password ?? null
    );
  };

  activate = async (id: string, password: string) => {
    await this.db.user.update({
      where: { id },
      data: { active: true, password },
    });
  };

  createToken = async (id: string) => {
    const token = Math.floor(100000 + Math.random() * 900000);
    return this.db.verificationToken.create({
      data: { token, userId: id },
    });
  };

  getToken = async (id: string) => {
    return this.db.verificationToken.findUnique({
      where: { id },
    });
  };

  verify = async (id: string) => {
    await this.db.user.update({
      where: { id },
      data: { verified: true },
    });
  };

  getActiveReservations = async (userId: string) => {
    return this.db.reservation.findMany({
      where: {
        userId,
        cancelled: false,
        completed: false,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      include: { box: true },
    });
  };

  getReservations = async (userId: string) => {
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
  };

  hasUnreturnedBorrow = async (id: string, stationId: string) => {
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
  };
  getActiveBorrowBox = async (id: string, stationId: string) => {
    const borrow = await this.db.log.findFirst({
      where: { userId: id, stationId, action: 'BORROW' },
      orderBy: { createdAt: 'desc' },
      take: 1,
      include: { box: true },
    });
    return borrow?.box ?? null;
  };
}
