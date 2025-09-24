import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { ILogService } from '@/log';

import { MockUserDatasource } from './datasource/mock-datasource';
import { IUserDatasource, UserService } from './user.service';

export interface IUser {
  id: string;
  name: string;
}

export interface IUserService {
  getUser(): IUser;
}

export const UserModule = new ContainerModule(({ bind }) => {
  bind<IUserService>(AppModule.USER)
    .toDynamicValue(context => createUserService(context))
    .inSingletonScope();
});

const createUserService = (context: ResolutionContext): IUserService => {
  const logService: ILogService = context.get(AppModule.LOG);
  const dataSource: IUserDatasource = createDatasource(context);

  return new UserService(dataSource, logService);
};

const createDatasource = (_context: ResolutionContext): IUserDatasource => {
  // const httpClient: IHttpClient = context.get(AppModule.HTTP);

  // return new RemoteUserDatasource(httpClient);
  return new MockUserDatasource();
};
