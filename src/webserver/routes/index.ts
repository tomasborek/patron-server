import { Router } from 'express';
import type { Request, Response } from 'express';
import { boxRouter, institutionRouter, logRouter, reservationRouter, trim, userRouter } from '../container';

export default Router()
  .use(trim)
  .use('/user', userRouter)
  .use('/institution', institutionRouter)
  .use('/box', boxRouter)
  .use('/reservation', reservationRouter)
  .use('/log', logRouter)
  .get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
  })
  .use('*', (req: Request, res: Response) => {
    res.status(404).send({ message: 'Not found' });
  });
