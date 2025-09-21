import React from 'react';
import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IRouter } from '@/router';

import { ISessionService } from '../session';
import { IRegisterVM, Register } from './register.component';
import { RegisterVM } from './register.vm';

export type IRegisterRoute = '/register';

export const createRegisterScreen = (context: ResolutionContext): React.FC => {
  return () => {
    const viewModel: IRegisterVM = createRegisterVM(context);

    return React.createElement(Register, { vm: viewModel });
  };
};

const createRegisterVM = (context: ResolutionContext): IRegisterVM => {
  const router: IRouter = context.get(AppModule.ROUTER);
  const sessionService: ISessionService = context.get(AppModule.SESSION);

  return new RegisterVM(router, sessionService);
};
