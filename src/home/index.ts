import React from 'react';
import { ContainerModule, ResolutionContext } from 'inversify';

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

export const HomeScreenModule = new ContainerModule(({ bind }) => {
  bind<React.FC>(AppModule.HOME_SCREEN)
    .toFactory(context => createHomeScreen(context));
});

const createHomeScreen = (context: ResolutionContext): React.FC => {
  return () => {
    const viewModel: IHomeVM = createHomeViewModel(context);

    return React.createElement(Home, { vm: viewModel });
  };
};

const createHomeViewModel = (context: ResolutionContext): IHomeVM => {
  const router: IRouter = context.get(AppModule.ROUTER);
  const welcomeHeaderVM: IWelcomeHeaderVM = createWelcomeHeaderVM(context);
  const postsDatasource: IPostsDatasource = context.get(AppModule.POSTS_DATASOURCE);
  const postsFactory: IPostsListFactory = context.get(AppModule.POSTS_VM);

  return new HomeVM(
    router,
    welcomeHeaderVM,
    postsDatasource,
    postsFactory,
  );
};

const createWelcomeHeaderVM = (context: ResolutionContext): IWelcomeHeaderVM => {
  const userService: IUserService = context.get(AppModule.USER);
  const pushNotificationService: IPushNotificationService = context.get(AppModule.PUSH_NOTIFICATION);
  const sessionService: ISessionService = context.get(AppModule.SESSION);
  const router: IRouter = context.get(AppModule.ROUTER);

  return new WelcomeHeaderVM(
    userService,
    pushNotificationService,
    sessionService,
    router,
  );
};
