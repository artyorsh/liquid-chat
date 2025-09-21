import React from 'react';
import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IRouter } from '@/router';

import { ISessionService } from '../auth/session';
import { ISplashVM, Splash } from './splash.component';
import { IExpoSplashConfig, ISplashAnimation, ISplashScreenTask, SplashVM } from './splash.vm';
import { SplashAnimation } from './splash-animation';
import { SessionRestoreTask } from './tasks/session-restore-task';

export type ISplashRoute = '/';

export const SplashScreenModule = new ContainerModule(({ bind }) => {
  bind<React.FC>(AppModule.SPLASH_SCREEN)
    .toFactory(context => createSplashScreen(context));
});

const createSplashScreen = (context: ResolutionContext): React.FC => {
  return () => {
    const viewModel: ISplashVM = createSplashViewModel(context);

    return React.createElement(Splash, { vm: viewModel });
  };
};

const createSplashViewModel = (context: ResolutionContext): ISplashVM => {
  const router: IRouter = context.get(AppModule.ROUTER);

  const expoSplashConfig: IExpoSplashConfig = {
    backgroundColor: theme => theme.colors.background,
    image: _theme => require('../../assets/images/ic-launcher-foreground.png'),
    imageWidth: 256,
  };

  const animation: ISplashAnimation = new SplashAnimation({
    duration: 400,
  });

  const sessionService: ISessionService = context.get(AppModule.SESSION);
  const sessionRestoreTask: ISplashScreenTask = new SessionRestoreTask(sessionService);

  return new SplashVM(router, {
    ...expoSplashConfig,
    task: sessionRestoreTask,
    animation: animation,
  });
};
