import React from 'react';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di';
import { ISessionService } from '@/auth/session';
import { IPostsDatasource, IPostsListFactory } from '@/posts';
import { IPushNotificationService } from '@/push-notification';
import { IRouter } from '@/router';
import { IUserService } from '@/user';

import { Home, IHomeVM } from './home.component';
import { HomeVM } from './home.vm';

export type IHomeRoute = '/home';

export const HomeScreenModule = new ContainerModule(bind => {
  bind<interfaces.Factory<React.FC>>(AppModule.HOME_SCREEN)
    .toFactory(context => () => React.createElement(Home, { vm: createHomeVM(context) }));
});

const createHomeVM = (context: interfaces.Context): IHomeVM => {
  const router: IRouter = context.container.get(AppModule.ROUTER);
  const sessionService: ISessionService = context.container.get(AppModule.SESSION);
  const userService: IUserService = context.container.get(AppModule.USER);
  const pushNotificationService: IPushNotificationService = context.container.get(AppModule.PUSH_NOTIFICATION);

  const postsApi: IPostsDatasource = context.container.get(AppModule.POSTS_DATASOURCE);
  const postsFactory: IPostsListFactory = context.container.get(AppModule.POSTS_VM);

  return new HomeVM(
    sessionService,
    userService,
    pushNotificationService,
    router,
    postsApi,
    postsFactory,
  );
};
