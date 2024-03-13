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
      .catch((e) => {
        console.log(e);
        logger.error('Database connection failed');
      });
    const server = new Server(router);
    server.listen(
      Number(config.app.port),
      () => {
        logger.info(`Server listening on port ${config.app.port}`);
      },
      async (io) => {
        io.on('connection', (socket) => {
          logger.info(`Socket connected ${socket.id}`);
          if (socket.handshake.auth.password !== config.passwords.interface) socket.disconnect();
          if (socket?.handshake?.query?.id) {
            stationUsecase.getBoxesStatus(socket.handshake.query.id as string).then((boxes) => {
              setTimeout(() => {
                socket.emit('status', { event: 'boxesStatus', data: { id: socket.handshake.query.id, boxes } });
              }, 1000);
            });
          }
          socket.on('message', async (data) => {
            try {
              if (data.event === 'return') {
                const box = await stationUsecase.getBoxForReturn(data.data.id, data.data.code);
                return io.sockets.emit('message', { event: 'return', data: { id: data.data.id, boxId: box } });
              }
              if (data.event === 'reservation') {
                const box = await stationUsecase.getBoxForReservation(data.data.id, data.data.code);
                return io.sockets.emit('message', { event: 'reservation', data: { id: data.data.id, boxId: box } });
              }
              if (data.event === 'boxesStatus') {
                const boxes = await stationUsecase.getBoxesStatus(data.data.id);
                return io.sockets.emit('message', { event: 'boxesStatus', data: { id: data.data.id, boxes } });
              }
              if (data.event === 'borrow') {
                const box = await stationUsecase.borrow(data.data.id, data.data.code, data.data.boxId);
                return io.sockets.emit('message', { event: 'borrow', data: { id: data.data.id, boxId: box } });
              }
              throw new Error('Invalid event');
            } catch (error) {
              logger.error("Couldn't process message", error);
            }
          });
        });
      },
    );
  } catch (error) {
    logger.error(error);
  }
})();
