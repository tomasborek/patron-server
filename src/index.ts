import logger from '@/utils/logger';
import Server from './webserver/server';
import router from '@/webserver/routes';
import Database from './utils/db';
import config from './webserver/config';

(async () => {
  try {
    Database.getInstance()
      .connect()
      .then(() => {
        logger.info('Database connected');
      })
      .catch(() => {
        logger.error('Database connection failed');
      });
    const server = new Server(router);
    server.listen(Number(config.app.port), () => {
      logger.info(`Server listening on port ${config.app.port}`);
    });
  } catch (error) {
    logger.error(error);
  }
})();
