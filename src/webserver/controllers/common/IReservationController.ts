import { Request, Response } from 'express';

interface IReservationController {
  cancel: (req: Request, res: Response) => Promise<void>;
}

export default IReservationController;
