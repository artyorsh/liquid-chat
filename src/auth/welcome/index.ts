import React from 'react';
import { interfaces } from 'inversify';

import { AppModule } from '@/di/model';

import { IWelcomeVM, Welcome } from './welcome.component';
import { WelcomeVM } from './welcome.vm';

export type IWelcomeRoute = '/welcome';

export const WelcomeScreenFactory = (context: interfaces.Context): React.FC => {
  return () => React.createElement(Welcome, { vm: createWelcomeVM(context) });
};

const createWelcomeVM = (context: interfaces.Context): IWelcomeVM => {
  return new WelcomeVM(context.container.get(AppModule.ROUTER));
};
