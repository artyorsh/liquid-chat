import React from 'react';
import { interfaces } from 'inversify';

import { AppModule } from '@/di/model';
import { IRouter } from '@/router';

import { ISessionService } from '../session';
import { ISplashVM, Splash } from './splash.component';
import { IExpoSplashConfig, ISplashAnimation, ISplashScreenTask, SplashVM } from './splash.vm';
import { SplashAnimation } from './splash-animation';
import { SessionRestoreTask } from './tasks/session-restore-task';

export type ISplashRoute = '/';

export const SplashScreenFactory = (context: interfaces.Context): React.FC => {
  return () => React.createElement(Splash, { vm: createSplashVM(context) });
};

const createSplashVM = (context: interfaces.Context): ISplashVM => {
  const router: IRouter = context.container.get(AppModule.ROUTER);
  const sessionService: ISessionService = context.container.get(AppModule.SESSION);
  const sessionRestoreTask: ISplashScreenTask = new SessionRestoreTask(sessionService);

  const expoSplashConfig: IExpoSplashConfig = {
    backgroundColor: '#fbfbfb',
    image: require('../../../assets/images/ic-launcher-foreground.png'),
    imageWidth: 256,
  };

  const animation: ISplashAnimation = new SplashAnimation({
    duration: 400,
  });

  return new SplashVM(router, {
    ...expoSplashConfig,
    task: sessionRestoreTask,
    animation: animation,
  });
};
