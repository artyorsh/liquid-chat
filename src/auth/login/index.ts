import React from 'react';
import { interfaces } from 'inversify';

import { AppModule } from '@/di/model';

import { ILoginVM, Login } from './login.component';
import { LoginVM } from './login.vm';

export type ILoginRoute = '/login';

export const LoginScreenFactory = (context: interfaces.Context): React.FC => {
  return () => React.createElement(Login, { vm: createLoginVM(context) });
};

const createLoginVM = (context: interfaces.Context): ILoginVM => {
  return new LoginVM(
    context.container.get(AppModule.ROUTER),
    context.container.get(AppModule.SESSION),
  );
};
