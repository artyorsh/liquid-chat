import { ReactNavigationRouter } from './react-navigation/react-navigation-router';
import { StackRouteFactory } from './react-navigation/stack-route-factory';
import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IAuthRoute } from '@/auth';
import { IHomeRoute } from '@/home';
import { ILogger, ILogService } from '@/log';
import { ISplashRoute } from '@/splash';

export type IRoute =
  | ISplashRoute
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
  getCurrentRoute(): IRoute;
  /**
   * @returns a function to unsubscribe the listener
   */
  subscribe(route: IRoute, listener: INavigationLifecycleListener): Function;
}

export const RouterModule = new ContainerModule(({ bind }) => {
  bind<IRouter>(AppModule.ROUTER)
    .toDynamicValue(context => createRouter(context))
    .inSingletonScope();
});

const createRouter = (context: ResolutionContext): IRouter => {
  const logService: ILogService = context.get(AppModule.LOG);
  const logger: ILogger = logService.createLogger(ReactNavigationRouter.name);

  return new ReactNavigationRouter(logger, StackRouteFactory({
    '/': context.get(AppModule.SPLASH_SCREEN),
    '/welcome': context.get(AppModule.WELCOME_SCREEN),
    '/login': context.get(AppModule.LOGIN_SCREEN),
    '/register': context.get(AppModule.REGISTER_SCREEN),
    '/home': context.get(AppModule.HOME_SCREEN),
  }));
};
