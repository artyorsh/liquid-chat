import React from 'react';
import { interfaces } from 'inversify';

import { ROUTER_SERVICE_ID } from '@/router';

import { IWelcomeVM, Welcome } from './welcome.component';
import { WelcomeVM } from './welcome.vm';

export type IWelcomeRoute = '/welcome';

export const WELCOME_SCREEN_SERVICE_ID: symbol = Symbol.for('WelcomeScreen');

export const WelcomeScreenFactory = (context: interfaces.Context): React.FC => {
  return () => React.createElement(Welcome, { vm: createWelcomeVM(context) });
};

const createWelcomeVM = (context: interfaces.Context): IWelcomeVM => {
  return new WelcomeVM(context.container.get(ROUTER_SERVICE_ID));
};
