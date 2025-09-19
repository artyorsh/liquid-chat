import React from 'react';
import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';

import { ILoginVM, Login } from './login.component';
import { LoginVM } from './login.vm';

export type ILoginRoute = '/login';

export const LoginScreenFactory = (context: ResolutionContext): React.FC => {
  return () => React.createElement(Login, { vm: createLoginVM(context) });
};

const createLoginVM = (context: ResolutionContext): ILoginVM => {
  return new LoginVM(
    context.get(AppModule.ROUTER),
    context.get(AppModule.SESSION),
  );
};
