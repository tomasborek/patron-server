import { z } from 'zod';

const userValidator = {
  auth: z
    .object({
      email: z.string().email().max(255),
      password: z.string().min(8).max(255),
    })
    .strict(),
  activate: z
    .object({
      email: z.string().email().max(255),
      password: z.string().min(8).max(255),
    })
    .strict(),
  verify: z.object({
    code: z.number().min(0).max(999999),
  }),
};

export default userValidator;
