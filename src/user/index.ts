import { ContainerModule, interfaces } from 'inversify';

import { ILogService, LOG_SERVICE_ID } from '@/log';

import { IUserRepository, UserService } from './user.service';
import { UserApi } from './user-api';

export interface IUser {
  id: string;
  name: string;
}

export interface IUserService {
  getUser(): IUser;
}

export const USER_SERVICE_ID: symbol = Symbol.for('UserService');

export const UserModule = new ContainerModule(bind => {
  bind<IUserService>(USER_SERVICE_ID)
    .toDynamicValue(context => createUserService(context))
    .inSingletonScope();
});

const createUserService = (context: interfaces.Context): IUserService => {
  const logService: ILogService = context.container.get(LOG_SERVICE_ID);
  const userApi: IUserRepository = new UserApi();

  return new UserService(userApi, logService);
};
