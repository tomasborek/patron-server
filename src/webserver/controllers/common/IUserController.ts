import type { Request, Response } from 'express';
interface IUserController {
  auth: (req: Request, res: Response) => Promise<void>;
  getMe: (req: Request, res: Response) => Promise<void>;
  activate: (req: Request, res: Response) => Promise<void>;
  verify: (req: Request, res: Response) => Promise<void>;
  getReservations: (req: Request, res: Response) => Promise<void>;
}

export default IUserController;
