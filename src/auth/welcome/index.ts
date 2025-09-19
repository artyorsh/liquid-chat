import React from 'react';
import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';

import { IWelcomeVM, Welcome } from './welcome.component';
import { WelcomeVM } from './welcome.vm';

export type IWelcomeRoute = '/welcome';

export const WelcomeScreenFactory = (context: ResolutionContext): React.FC => {
  return () => React.createElement(Welcome, { vm: createWelcomeVM(context) });
};

const createWelcomeVM = (context: ResolutionContext): IWelcomeVM => {
  return new WelcomeVM(context.get(AppModule.ROUTER));
};
