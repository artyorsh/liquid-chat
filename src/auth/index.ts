import React from 'react';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di/model';

import { ILoginRoute, LoginScreenFactory } from './login';
import { IRegisterRoute, RegisterScreenFactory } from './register';
import { ISessionService, SessionServiceFactory } from './session';
import { ISplashRoute, SplashScreenFactory } from './splash';
import { IWelcomeRoute, WelcomeScreenFactory } from './welcome';

export type IAuthRoute =
  | ISplashRoute
  | IWelcomeRoute
  | ILoginRoute
  | IRegisterRoute;

export const AuthModule = new ContainerModule(bind => {
  bind<ISessionService>(AppModule.SESSION)
    .toDynamicValue(context => SessionServiceFactory(context))
    .inSingletonScope();

  bind<interfaces.Factory<React.FC>>(AppModule.SPLASH_SCREEN)
    .toFactory(context => SplashScreenFactory(context));

  bind<interfaces.Factory<React.FC>>(AppModule.WELCOME_SCREEN)
    .toFactory(context => WelcomeScreenFactory(context));

  bind<interfaces.Factory<React.FC>>(AppModule.LOGIN_SCREEN)
    .toFactory(context => LoginScreenFactory(context));

  bind<interfaces.Factory<React.FC>>(AppModule.REGISTER_SCREEN)
    .toFactory(context => RegisterScreenFactory(context));
});
