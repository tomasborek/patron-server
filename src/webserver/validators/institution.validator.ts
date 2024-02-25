import { z } from 'zod';
const institutionValidator = {
  create: z.object({
    name: z.string().min(3).max(255),
  }),
  createStation: z
    .object({
      name: z.string().min(3).max(255),
      boxesCount: z.number().min(1).max(20),
    })
    .strict(),
  addUser: z.object({
    email: z.string().email(),
    role: z.enum(['ADMIN', 'USER']),
  }),
  getMany: z
    .object({
      name: z.string().max(255).optional(),
      page: z.number().min(1).optional(),
    })
    .strict(),
  getUsers: z.object({
    page: z.string().optional(),
  }),
};

export type InstitutionCreate = z.infer<typeof institutionValidator.create>;
export type InstitutionGetMany = z.infer<typeof institutionValidator.getMany>;
export type InstitutionCreateStation = z.infer<typeof institutionValidator.createStation>;

export default institutionValidator;
