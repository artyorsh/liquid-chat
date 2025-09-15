import React from 'react';
import { ContainerModule, interfaces } from 'inversify';

import { ILoginRoute, LOGIN_SCREEN_SERVICE_ID, LoginScreenFactory } from './login';
import { IRegisterRoute, REGISTER_SCREEN_SERVICE_ID, RegisterScreenFactory } from './register';
import { ISessionService, SESSION_SERVICE_ID, SessionServiceFactory } from './session';
import { ISplashRoute, SPLASH_SCREEN_SERVICE_ID, SplashScreenFactory } from './splash';
import { IWelcomeRoute, WELCOME_SCREEN_SERVICE_ID, WelcomeScreenFactory } from './welcome';

export type IAuthRoute =
  | ISplashRoute
  | IWelcomeRoute
  | ILoginRoute
  | IRegisterRoute;

export const AuthModule = new ContainerModule(bind => {
  bind<ISessionService>(SESSION_SERVICE_ID)
    .toDynamicValue(context => SessionServiceFactory(context))
    .inSingletonScope();

  bind<interfaces.Factory<React.FC>>(SPLASH_SCREEN_SERVICE_ID)
    .toFactory(context => SplashScreenFactory(context));

  bind<interfaces.Factory<React.FC>>(WELCOME_SCREEN_SERVICE_ID)
    .toFactory(context => WelcomeScreenFactory(context));

  bind<interfaces.Factory<React.FC>>(LOGIN_SCREEN_SERVICE_ID)
    .toFactory(context => LoginScreenFactory(context));

  bind<interfaces.Factory<React.FC>>(REGISTER_SCREEN_SERVICE_ID)
    .toFactory(context => RegisterScreenFactory(context));
});
