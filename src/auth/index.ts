import { ContainerModule } from 'inversify';

import { AppModule } from '@/di';

import { createLoginScreen, ILoginRoute } from './login';
import { createRegisterScreen, IRegisterRoute } from './register';
import { createSessionService, ISessionService } from './session';
import { createWelcomeScreen, IWelcomeRoute } from './welcome';

export type IAuthRoute =
  | IWelcomeRoute
  | ILoginRoute
  | IRegisterRoute;

export const AuthModule = new ContainerModule(({ bind }) => {
  bind<ISessionService>(AppModule.SESSION)
    .toDynamicValue(context => createSessionService(context))
    .inSingletonScope();

  bind<React.FC>(AppModule.WELCOME_SCREEN)
    .toFactory(context => createWelcomeScreen(context));

  bind<React.FC>(AppModule.LOGIN_SCREEN)
    .toFactory(context => createLoginScreen(context));

  bind<React.FC>(AppModule.REGISTER_SCREEN)
    .toFactory(context => createRegisterScreen(context));
});
