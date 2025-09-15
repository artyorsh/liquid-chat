import { ReactNavigationRouter } from './react-navigation/react-navigation-router';
import { StackRouteFactory } from './react-navigation/stack-route-factory';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di/model';
import { IAuthRoute } from '@/auth';
import { IHomeRoute } from '@/home';
import { ILogService } from '@/log';

export type IRoute =
  | IAuthRoute
  | IHomeRoute;

export type IRouteParams = Record<string, any>;

export interface INavigationLifecycleListener {
  onFocus?(): void;
  onBlur?(): void;
}

export interface IRouter {
  getWindow(): React.ReactElement;
  navigate(route: IRoute, params?: IRouteParams): void;
  replace(route: IRoute, params?: IRouteParams): void;
  goBack(): void;
  /**
   * @returns a function to unsubscribe the listener
   */
  subscribe(route: IRoute, listener: INavigationLifecycleListener): Function;
}

export const RouterModule = new ContainerModule(bind => {
  bind<IRouter>(AppModule.ROUTER)
    .toDynamicValue(context => createRouter(context))
    .inSingletonScope();
});

const createRouter = (context: interfaces.Context): IRouter => {
  const logService: ILogService = context.container.get(AppModule.LOG);

  return new ReactNavigationRouter(logService, StackRouteFactory({
    '/': context.container.get(AppModule.SPLASH_SCREEN),
    '/welcome': context.container.get(AppModule.WELCOME_SCREEN),
    '/login': context.container.get(AppModule.LOGIN_SCREEN),
    '/register': context.container.get(AppModule.REGISTER_SCREEN),
    '/home': context.container.get(AppModule.HOME_SCREEN),
  }));
};

