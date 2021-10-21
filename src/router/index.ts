import { ReactNavigationRouter } from './react-navigation/react-navigation-router';
import { StackRouteFactory } from './react-navigation/stack-route-factory';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di';
import { IChatRoute } from '@/chat';
import { ILogger, ILogService } from '@/log';
import { ISplashRoute } from '@/splash';

export type IRoute =
  | ISplashRoute
  | IChatRoute;

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
  const logger: ILogger = logService.createLogger(ReactNavigationRouter.name);

  return new ReactNavigationRouter(logger, StackRouteFactory({
    '/': context.container.get(AppModule.SPLASH_SCREEN),
    '/chats': context.container.get(AppModule.CHAT_GROUPS_SCREEN),
    '/chats/:id': context.container.get(AppModule.CHAT_SCREEN),
  }));
};

