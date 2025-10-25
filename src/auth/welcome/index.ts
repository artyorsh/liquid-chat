import { createElement, FC, useMemo } from 'react';
import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IRouter } from '@/router';

import { IWelcomeVM, Welcome } from './welcome.component';
import { WelcomeVM } from './welcome.vm';

export type IWelcomeRoute = '/auth';

export const createWelcomeScreen = (context: ResolutionContext): FC => {
  const WelcomeScreenContainer: FC = () => {
    const viewModel: IWelcomeVM = useMemo(() => createWelcomeViewModel(context), []);

    return createElement(Welcome, { vm: viewModel });
  };

  return WelcomeScreenContainer;
};

const createWelcomeViewModel = (context: ResolutionContext): IWelcomeVM => {
  const router: IRouter = context.get(AppModule.ROUTER);

  return new WelcomeVM(router);
};
