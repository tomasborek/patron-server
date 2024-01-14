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

const db = Database.getInstance().getClient();

//repositories
const userRepository = new UserRepository(db);
const institutionRepository = new InstitutionRepository(db);
const boxRepository = new BoxRepository(db);

//usecases
const userUsecase = new UserUsecase(userRepository, institutionRepository, boxRepository);
const institutionUsecase = new InstitutionUsecase(institutionRepository, userRepository, boxRepository);

//observers
const emailObserver = new EmailObserver(userRepository);
userUsecase.subscribe(emailObserver);

//controllers
const userController = new UserController(userUsecase);
const institutionController = new InstitutionController(institutionUsecase);

//middleware
export const auth = new AuthMiddlewareFactory(userRepository).getMiddleware();
export const developer = new DeveloperMiddlewareFacoty(auth).getMiddleware();
export const trim = new TrimMiddlewareFactory().getMiddleware();
export const controller = new ControllerMiddlewareFactory().getMiddleware();
export const validate = new ValidateMiddlewareFactory().getMiddleware();

//routers
export const userRouter = new UserRouter(userController).getRouter();
export const institutionRouter = new InstitutionRouter(institutionController).getRouter();
