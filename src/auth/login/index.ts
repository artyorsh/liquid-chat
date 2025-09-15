import React from 'react';
import { interfaces } from 'inversify';

import { ROUTER_SERVICE_ID } from '@/router';

import { SESSION_SERVICE_ID } from '../session';
import { ILoginVM, Login } from './login.component';
import { LoginVM } from './login.vm';

export type ILoginRoute = '/login';

export const LOGIN_SCREEN_SERVICE_ID: symbol = Symbol.for('LoginScreen');

export const LoginScreenFactory = (context: interfaces.Context): React.FC => {
  return () => React.createElement(Login, { vm: createLoginVM(context) });
};

const createLoginVM = (context: interfaces.Context): ILoginVM => {
  return new LoginVM(
    context.container.get(ROUTER_SERVICE_ID),
    context.container.get(SESSION_SERVICE_ID),
  );
};
