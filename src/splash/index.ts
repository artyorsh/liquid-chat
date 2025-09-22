import { createElement, useMemo } from 'react';
import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IRouter } from '@/router';

import { ISplashVM, Splash } from './splash.component';
import { IExpoSplashConfig, ISplashAnimation, SplashVM } from './splash.vm';
import { SplashAnimation } from './splash-animation';

export type ISplashRoute = '/';

export const SplashScreenModule = new ContainerModule(({ bind }) => {
  bind<React.FC>(AppModule.SPLASH_SCREEN)
    .toFactory(context => createSplashScreen(context));
});

const createSplashScreen = (context: ResolutionContext): React.FC => {
  return () => {
    const viewModel: ISplashVM = useMemo(() => createSplashViewModel(context), []);

    return createElement(Splash, { vm: viewModel });
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

  return new SplashVM(router, {
    ...expoSplashConfig,
    task: { run: () => Promise.resolve(['/chats', {}]) },
    animation: animation,
  });
};
