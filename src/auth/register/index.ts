import React from 'react';
import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';

import { IRegisterVM, Register } from './register.component';
import { RegisterVM } from './register.vm';

export type IRegisterRoute = '/register';
export const RegisterScreenFactory = (context: ResolutionContext): React.FC => {
  return () => React.createElement(Register, { vm: createRegisterVM(context) });
};

const createRegisterVM = (context: ResolutionContext): IRegisterVM => {
  return new RegisterVM(
    context.get(AppModule.ROUTER),
    context.get(AppModule.SESSION),
  );
};
