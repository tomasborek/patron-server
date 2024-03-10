import UserRepository from '@/repositories/user.repository';
import InstitutionUsecase from '@/usecases/institution.usecase';
import UserUsecase from '@/usecases/user.usecase';
import Database from '@/utils/db';
import DeveloperMiddlewareFacoty from '../middlewares/developer.middleware';
import AuthMiddlewareFactory from '../middlewares/auth.middleware';
import TrimMiddlewareFactory from '../middlewares/trim.middleware';
import ControllerMiddlewareFactory from '../middlewares/controller.middleware';
import { ValidateMiddlewareFactory } from '../middlewares/validate.middleware';
import UserRouter from '../routes/user.router';
import InstitutionRepository from '@/repositories/institution.repository';
import UserController from '../controllers/user.controller';
import InstitutionController from '../controllers/institution.controller';
import InstitutionRouter from '../routes/institution.router';
import EmailObserver from '@/observers/email.observer';
import BoxRepository from '@/repositories/box.repository';
import BoxUsecase from '@/usecases/box.usecase';
import BoxController from '../controllers/box.controller';
import BoxRouterFactory from '../routes/box.router';
import ReservationRouterFactory from '../routes/reservation.router';
import ReservationController from '../controllers/reservation.controller';
import ReservationUsecase from '@/usecases/reservation.usecase';
import ReservationRepository from '@/repositories/reservation.repository';
import LogRepository from '@/repositories/log.repository';
import LogObserver from '@/observers/log.observer';
import LogUsecase from '@/usecases/log.usecase';
import LogController from '../controllers/log.controller';
import LogRouterFactory from '../routes/log.router';
import StationUsecase from '@/usecases/station.usecase';
import StationRepository from '@/repositories/station.repository';
import Mailer from '../mail/mailer';

const db = Database.getInstance().getClient();

//repositories
const userRepository = new UserRepository(db);
const institutionRepository = new InstitutionRepository(db);
const boxRepository = new BoxRepository(db);
const reservationRepository = new ReservationRepository(db);
const logRepository = new LogRepository(db);
const stationRepository = new StationRepository(db);
const mailer = new Mailer();

//usecases
const userUsecase = new UserUsecase(userRepository, institutionRepository);
const institutionUsecase = new InstitutionUsecase(institutionRepository, userRepository, boxRepository);
const boxUsecase = new BoxUsecase(boxRepository, reservationRepository, userRepository);
const reservationUsecase = new ReservationUsecase(reservationRepository);
const logUsecase = new LogUsecase(logRepository, institutionRepository, userRepository);
export const stationUsecase = new StationUsecase(
  stationRepository,
  userRepository,
  reservationRepository,
  boxRepository,
);

//observers
const emailObserver = new EmailObserver(userRepository, mailer);
const logObserver = new LogObserver(logRepository, boxRepository);
userUsecase.subscribe(emailObserver);
institutionUsecase.subscribe(emailObserver);
userUsecase.subscribe(logObserver);
institutionUsecase.subscribe(logObserver);
boxUsecase.subscribe(logObserver);
reservationUsecase.subscribe(logObserver);
stationUsecase.subscribe(logObserver);

//controllers
const userController = new UserController(userUsecase);
const institutionController = new InstitutionController(institutionUsecase);
const boxController = new BoxController(boxUsecase);
const reservationController = new ReservationController(reservationUsecase);
const logController = new LogController(logUsecase);

//middleware
export const auth = new AuthMiddlewareFactory(userRepository).getMiddleware();
export const developer = new DeveloperMiddlewareFacoty(auth).getMiddleware();
export const trim = new TrimMiddlewareFactory().getMiddleware();
export const controller = new ControllerMiddlewareFactory().getMiddleware();
export const validate = new ValidateMiddlewareFactory().getMiddleware();

//routers
export const userRouter = new UserRouter(userController).getRouter();
export const institutionRouter = new InstitutionRouter(institutionController).getRouter();
export const boxRouter = new BoxRouterFactory(boxController).getRouter();
export const reservationRouter = new ReservationRouterFactory(reservationController).getRouter();
export const logRouter = new LogRouterFactory(logController).getRouter();
