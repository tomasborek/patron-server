import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import corsOptions from '@/utils/corsOptions';
import config from './config';

export default class Server {
  private readonly app: express.Application;
  constructor(router: express.Router) {
    this.app = express();

    this.app.use(helmet({ crossOriginResourcePolicy: false }));
    this.app.use(express.json());
    this.app.use(cors(corsOptions));
    this.app.use(
      morgan(':method [:url] :status :res[content-length] - :response-time ms')
    );
    this.app.use(config.app.prefix, router);
  }

  listen(port: number, callback: () => void) {
    this.app.listen(port, callback);
  }

  getServer() {
    return this.app;
  }
}
