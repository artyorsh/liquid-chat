import { ReactNavigationRouter } from './react-navigation/react-navigation-router';
import { StackRouteFactory } from './react-navigation/stack-route-factory';
import { ContainerModule, interfaces } from 'inversify';

import { IAuthRoute } from '@/auth';
import { LOGIN_SCREEN_SERVICE_ID } from '@/auth/login';
import { REGISTER_SCREEN_SERVICE_ID } from '@/auth/register';
import { SPLASH_SCREEN_SERVICE_ID } from '@/auth/splash';
import { WELCOME_SCREEN_SERVICE_ID } from '@/auth/welcome';
import { HOME_SCREEN_SERVICE_ID, IHomeRoute } from '@/home';
import { ILogService, LOG_SERVICE_ID } from '@/log';

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

export const ROUTER_SERVICE_ID: symbol = Symbol.for('RouterService');

export const RouterModule = new ContainerModule(bind => {
  bind<IRouter>(ROUTER_SERVICE_ID)
    .toDynamicValue(context => createRouter(context))
    .inSingletonScope();
});

const createRouter = (context: interfaces.Context): IRouter => {
  const logService: ILogService = context.container.get(LOG_SERVICE_ID);

  return new ReactNavigationRouter(logService, StackRouteFactory({
    '/': context.container.get(SPLASH_SCREEN_SERVICE_ID),
    '/welcome': context.container.get(WELCOME_SCREEN_SERVICE_ID),
    '/login': context.container.get(LOGIN_SCREEN_SERVICE_ID),
    '/register': context.container.get(REGISTER_SCREEN_SERVICE_ID),
    '/home': context.container.get(HOME_SCREEN_SERVICE_ID),
  }));
};

