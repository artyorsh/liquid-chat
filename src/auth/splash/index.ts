import React from 'react';
import { interfaces } from 'inversify';

import { IRouter, ROUTER_SERVICE_ID } from '@/router';

import { ISessionService, SESSION_SERVICE_ID } from '../session';
import { ISplashVM, Splash } from './splash.component';
import { IExpoSplashConfig, ISplashAnimation, ISplashScreenTask, SplashVM } from './splash.vm';
import { SplashAnimation } from './splash-animation';
import { SessionRestoreTask } from './tasks/session-restore-task';

export type ISplashRoute = '/';

export const SPLASH_SCREEN_SERVICE_ID: symbol = Symbol.for('SplashScreen');

export const SplashScreenFactory = (context: interfaces.Context): React.FC => {
  return () => React.createElement(Splash, { vm: createSplashVM(context) });
};

const createSplashVM = (context: interfaces.Context): ISplashVM => {
  const router: IRouter = context.container.get(ROUTER_SERVICE_ID);
  const sessionService: ISessionService = context.container.get(SESSION_SERVICE_ID);
  const sessionRestoreTask: ISplashScreenTask = new SessionRestoreTask(sessionService);

  const expoSplashConfig: IExpoSplashConfig = {
    backgroundColor: theme => theme.colors.background,
    image: _theme => require('../../../assets/images/ic-launcher-foreground.png'),
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
