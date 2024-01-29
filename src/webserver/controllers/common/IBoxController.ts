import type { Request, Response } from 'express';

export default interface IBoxController {
  createReservation: (req: Request, res: Response) => Promise<void>;
}
