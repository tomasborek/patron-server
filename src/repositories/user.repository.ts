import { PrismaClient } from '@prisma/client';
import IUserRepository from './common/IUserRepository';
import { UserInstitutionRole } from '@/domain/entities/enums';

export default class UserRepository implements IUserRepository {
  constructor(private db: PrismaClient) {}
  create = (
    email: string,
    institutionId: string,
    role: UserInstitutionRole
  ) => {
    return this.db.user.create({
      data: {
        email: email,
        userInstitutions: {
          create: { institutionId: institutionId, role },
        },
      },
    });
  };
  getById = (id: string) => {
    return this.db.user.findUnique({ where: { id } });
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
    return user.userInstitutions.some(
      (ui) => ui.institutionId === institutionId
    );
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
}
