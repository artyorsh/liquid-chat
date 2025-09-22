import 'core-js/proposals/reflect-metadata';
import registerRootComponent from 'expo/src/launch/registerRootComponent';
import { Container } from 'inversify';

import '@/uilib';
import { AIModule } from '@/ai';
import { ChatModule } from '@/chat';
import { LogModule } from '@/log';
import { ModalModule } from '@/modal';
import { ProcessInfoModule } from '@/process-info';
import { RouterModule } from '@/router';
import { SplashScreenModule } from '@/splash';

import { App } from './src/app';

export const container = new Container();

container.load(
  AIModule,
  ChatModule,
  LogModule,
  RouterModule,
  ProcessInfoModule,
  ModalModule,
  SplashScreenModule,
);

registerRootComponent(() => {
  return <App get={serviceId => container.get(serviceId)} />;
});
