import type { Request, Response } from 'express';

interface ILogController {
  get(req: Request, res: Response): Promise<void>;
}

export default ILogController;
