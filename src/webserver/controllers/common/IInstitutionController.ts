import type { Request, Response } from 'express';
interface IInstitutionController {
  create: (req: Request, res: Response) => Promise<void>;
  addUser: (req: Request, res: Response) => Promise<void>;
}

export default IInstitutionController;
