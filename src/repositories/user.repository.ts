import { PrismaClient } from '@prisma/client';
import IUserRepository from './common/IUserRepository';
import { UserInstitutionRole } from '@/domain/entities/enums';
import { ReservationCreate } from '@/webserver/validators/reservation.validator';

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
  activate = async (id: string) => {
    await this.db.user.update({
      where: { id },
      data: { active: true },
    });
  };
  setPassword = (id: string, password: string) => {
    return this.db.user.update({
      where: { id },
      data: { password },
    });
  };
  createToken = async (id: string) => {
    const token = Math.floor(100000 + Math.random() * 900000);
    await this.db.verificationToken.create({
      data: { token, userId: id },
    });
    return token;
  };
  getToken = async (id: string) => {
    return (
      (
        await this.db.verificationToken.findUnique({
          where: { userId: id },
          select: { token: true },
        })
      )?.token ?? null
    );
  };
  verify = async (id: string) => {
    await this.db.user.update({
      where: { id },
      data: { verified: true },
    });
  };
  getReservations = async (userId: string) => {
    const reservations = await this.db.reservation.findMany({
      where: { userId },
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
  createReservation = async (data: ReservationCreate, userId: string) => {
    await this.db.reservation.create({
      data: {
        userId,
        boxId: data.boxId,
      },
    });
  };
}
