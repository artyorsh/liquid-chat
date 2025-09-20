import React from 'react';
import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IRouter } from '@/router';

import { IWelcomeVM, Welcome } from './welcome.component';
import { WelcomeVM } from './welcome.vm';

export type IWelcomeRoute = '/welcome';

export const createWelcomeScreen = (context: ResolutionContext): React.FC => {
  const viewModel: IWelcomeVM = createWelcomeViewModel(context);

  return () => React.createElement(Welcome, { vm: viewModel });
};

const createWelcomeViewModel = (context: ResolutionContext): IWelcomeVM => {
  const router: IRouter = context.get(AppModule.ROUTER);

  return new WelcomeVM(router);
};
