import { z } from 'zod';
const institutionValidator = {
  create: z.object({
    name: z.string().min(3).max(255),
  }),
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
};

export type InstitutionCreate = z.infer<typeof institutionValidator.create>;
export type InstitutionGetMany = z.infer<typeof institutionValidator.getMany>;

export default institutionValidator;
