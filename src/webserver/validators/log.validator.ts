import { z } from 'zod';

const logValidator = {
  get: z
    .object({
      userId: z.string().optional(),
      institutionId: z.string().optional(),
      page: z.string().optional(),
    })
    .strict(),
};

export type TLogGet = z.infer<typeof logValidator.get>;

export default logValidator;
