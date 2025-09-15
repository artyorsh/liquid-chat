import React from 'react';
import { interfaces } from 'inversify';

import { AppModule } from '@/di/model';

import { IRegisterVM, Register } from './register.component';
import { RegisterVM } from './register.vm';

export type IRegisterRoute = '/register';
export const RegisterScreenFactory = (context: interfaces.Context): React.FC => {
  return () => React.createElement(Register, { vm: createRegisterVM(context) });
};

const createRegisterVM = (context: interfaces.Context): IRegisterVM => {
  return new RegisterVM(
    context.container.get(AppModule.ROUTER),
    context.container.get(AppModule.SESSION),
  );
};
