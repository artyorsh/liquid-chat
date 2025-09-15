import { Container } from 'inversify';

import { AuthModule } from '@/auth';
import { HomeScreenModule } from '@/home';
import { LogModule } from '@/log';
import { ModalModule } from '@/modal';
import { ProcessInfoModule } from '@/process-info';
import { PushNotificationModule } from '@/push-notification';
import { RouterModule } from '@/router';
import { SplashScreenModule } from '@/splash';
import { UserModule } from '@/user';

export const container = new Container();

container.load(
  AuthModule,
  LogModule,
  RouterModule,
  ProcessInfoModule,
  PushNotificationModule,
  ModalModule,
  UserModule,
  SplashScreenModule,
  HomeScreenModule,
);
