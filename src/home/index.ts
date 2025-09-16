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
import { IWelcomeHeaderVM } from './welcome-header/welcome-header.component';
import { WelcomeHeaderVM } from './welcome-header/welcome-header.vm';

export type IHomeRoute = '/home';

export const HomeScreenModule = new ContainerModule(bind => {
  bind<interfaces.Factory<React.FC>>(AppModule.HOME_SCREEN)
    .toFactory(context => () => React.createElement(Home, { vm: createHomeVM(context) }));
});

const createHomeVM = (context: interfaces.Context): IHomeVM => {
  const router: IRouter = context.container.get(AppModule.ROUTER);
  const welcomeHeaderVM: IWelcomeHeaderVM = createWelcomeHeaderVM(context);
  const postsDatasource: IPostsDatasource = context.container.get(AppModule.POSTS_DATASOURCE);
  const postsFactory: IPostsListFactory = context.container.get(AppModule.POSTS_VM);

  return new HomeVM(
    router,
    welcomeHeaderVM,
    postsDatasource,
    postsFactory,
  );
};

const createWelcomeHeaderVM = (context: interfaces.Context): IWelcomeHeaderVM => {
  const userService: IUserService = context.container.get(AppModule.USER);
  const pushNotificationService: IPushNotificationService = context.container.get(AppModule.PUSH_NOTIFICATION);
  const sessionService: ISessionService = context.container.get(AppModule.SESSION);
  const router: IRouter = context.container.get(AppModule.ROUTER);

  return new WelcomeHeaderVM(
    userService,
    pushNotificationService,
    sessionService,
    router,
  );
};
