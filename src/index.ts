import logger from '@/utils/logger';
import Server from './webserver/server';
import router from '@/webserver/routes';
import Database from './utils/db';
import config from './webserver/config';
import { stationUsecase } from './webserver/container';

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
    server.listen(
      Number(config.app.port),
      () => {
        logger.info(`Server listening on port ${config.app.port}`);
      },
      (socket) => {
        logger.info(`Socket connected ${socket.id}`);
        socket.on('message', async (data) => {
          try {
            if (data.event === 'return') {
              const box = await stationUsecase.getBoxForReturn(data.data.id, data.data.code);
              return socket.emit('message', { event: 'return', data: { id: data.data.id, boxId: box } });
            }
            if (data.event === 'reservation') {
              const box = await stationUsecase.getBoxForReservation(data.data.id, data.data.code);
              return socket.emit('message', { event: 'reservation', data: { id: data.data.id, boxId: box } });
            }
            if (data.event === 'boxesStatus') {
              const boxes = await stationUsecase.getBoxesStatus(data.data.id);
              return socket.emit('message', { event: 'boxesStatus', data: { id: data.data.id, boxes } });
            }
            if (data.event === 'borrow') {
              await stationUsecase.borrow(data.data.id, data.data.code);
              return socket.emit('message', { event: 'borrow', data: { id: data.data.id } });
            }
            throw new Error('Invalid event');
          } catch (error) {
            logger.error("Couldn't process message", error);
          }
        });
      },
    );
  } catch (error) {
    logger.error(error);
  }
})();
