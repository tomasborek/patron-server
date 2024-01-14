import { z } from 'zod';

const reservationValidator = {
  create: z
    .object({
      boxId: z.string().uuid(),
    })
    .strict(),
};

export type ReservationCreate = z.infer<typeof reservationValidator.create>;

export default reservationValidator;
