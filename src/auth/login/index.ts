import React from 'react';
import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IRouter } from '@/router';

import { ISessionService } from '../session';
import { ILoginVM, Login } from './login.component';
import { LoginVM } from './login.vm';

export type ILoginRoute = '/auth/login';

export const createLoginScreen = (context: ResolutionContext): React.FC => {
  const viewModel: ILoginVM = createLoginVM(context);

  return () => {
    return React.createElement(Login, { vm: viewModel });
  };
};

const createLoginVM = (context: ResolutionContext): ILoginVM => {
  const router: IRouter = context.get(AppModule.ROUTER);
  const sessionService: ISessionService = context.get(AppModule.SESSION);

  return new LoginVM(router, sessionService);
};
