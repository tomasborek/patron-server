import { z } from 'zod';

const userValidator = {
  auth: z
    .object({
      email: z.string().email().max(255),
      password: z.string().min(8).max(255),
    })
    .strict(),
};

export default userValidator;
