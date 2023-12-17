import type { Request, Response } from 'express';
interface IUserController {
  auth: (req: Request, res: Response) => Promise<void>;
}

export default IUserController;
