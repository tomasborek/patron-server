import type { Request, Response } from 'express';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import corsOptions from '@/utils/corsOptions';
import config from './config';
import { Server as ServerIo } from 'socket.io';
import type { Server as HttpServer } from 'http';
import type { Socket } from 'socket.io';
import { SuccessResponse } from '@/utils/response';

export default class Server {
  private readonly app: express.Application;
  private httpServer: HttpServer | null;
  private io: ServerIo | null;
  constructor(router: express.Router) {
    this.app = express();
    this.httpServer = null;
    this.io = null;

    this.app.use(helmet({ crossOriginResourcePolicy: false }));
    this.app.use(express.json());
    this.app.use(cors(corsOptions));
    this.app.use(morgan(':method [:url] :status :res[content-length] - :response-time ms'));
    this.app.get('/health', (req: Request, res: Response) => {
      return new SuccessResponse({ res, data: { status: 'ok' } }).send();
    });
    this.app.use(config.app.prefix, router);
  }

  public listen(port: number, callback: () => void, socketCallback?: (io: ServerIo) => void) {
    this.httpServer = this.app.listen(port, () => {
      callback();
      if (socketCallback) {
        this.initSocket(socketCallback);
      }
    });
  }

  public initSocket(callback: (io: ServerIo) => void) {
    if (!this.httpServer) {
      throw new Error('Server is not running');
    }
    this.io = new ServerIo(this.httpServer, { cors: { origin: '*', methods: ['GET', 'POST'], credentials: true } });
    callback(this.io);
  }

  public getServer() {
    return this.app;
  }
}
