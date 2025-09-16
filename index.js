import 'core-js/proposals/reflect-metadata';
import registerRootComponent from 'expo/src/launch/registerRootComponent';
import { Container } from 'inversify';

import '@/uilib';
import { AuthModule } from '@/auth';
import { HomeScreenModule } from '@/home';
import { LogModule } from '@/log';
import { ModalModule } from '@/modal';
import { PostsModule } from '@/posts';
import { ProcessInfoModule } from '@/process-info';
import { PushNotificationModule } from '@/push-notification';
import { RouterModule } from '@/router';
import { SplashScreenModule } from '@/splash';
import { UserModule } from '@/user';

import { App } from './src/app';

export const container = new Container();

container.load(
  AuthModule,
  LogModule,
  RouterModule,
  ProcessInfoModule,
  PushNotificationModule,
  ModalModule,
  UserModule,
  PostsModule,
  SplashScreenModule,
  HomeScreenModule,
);

registerRootComponent(() => {
  return <App get={serviceId => container.get(serviceId)} />;
});
