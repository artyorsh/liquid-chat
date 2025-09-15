import React from 'react';
import { interfaces } from 'inversify';

import { ROUTER_SERVICE_ID } from '@/router';

import { SESSION_SERVICE_ID } from '../session';
import { IRegisterVM, Register } from './register.component';
import { RegisterVM } from './register.vm';

export type IRegisterRoute = '/register';

export const REGISTER_SCREEN_SERVICE_ID: symbol = Symbol.for('RegisterScreen');

export const RegisterScreenFactory = (context: interfaces.Context): React.FC => {
  return () => React.createElement(Register, { vm: createRegisterVM(context) });
};

const createRegisterVM = (context: interfaces.Context): IRegisterVM => {
  return new RegisterVM(
    context.container.get(ROUTER_SERVICE_ID),
    context.container.get(SESSION_SERVICE_ID),
  );
};
