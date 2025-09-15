import { interfaces } from 'inversify';

import { AppModule } from '@/di/model';
import { ILogger, ILogService } from '@/log';

import { ISessionModule } from './initialzier';
import { ParallelModuleInitializer } from './initialzier/parallel-module-initializer';
import { LocalAuthenticationProvider } from './local-auth-provider';
import { SecureAuthStorage } from './secure-auth-storage';
import { ISessionInitializer, SessionService } from './session.service';

export interface ISession {
  userId: string;
  secret: string;
}

export interface ISessionService {
  login(email: string, password: string): Promise<ISession>;
  register(email: string, password: string): Promise<ISession>;
  refresh(): Promise<ISession>;
  restore(): Promise<ISession>;
  logout(): Promise<void>;
}

export const SessionServiceFactory = (context: interfaces.Context): ISessionService => {
  const logService: ILogService = context.container.get(AppModule.LOG);
  const logger: ILogger = logService.createLogger(SessionService.name);

  const userModule: ISessionModule = context.container.get(AppModule.USER);
  const pushServiceModule: ISessionModule = context.container.get(AppModule.PUSH_NOTIFICATION);
  const sessionModules: ISessionModule[] = [userModule, pushServiceModule];

  const sessionInitializer: ISessionInitializer = new ParallelModuleInitializer(sessionModules, logger, {
    shouldFailOnModuleFailure: (module: ISessionModule, _error: Error): boolean => {
      return module.moduleIdentifier === 'UserService';
    },
  });

  return new SessionService({
    tokenRefreshThresholdMinutes: Number(process.env.EXPO_PUBLIC_AUTH_TOKEN_REFRESH_THRESHOLD_MINUTES) || 0,
    authenticationProvider: new LocalAuthenticationProvider(),
    authenticationStorage: new SecureAuthStorage(),
    initializer: sessionInitializer,
    logger: logger,
  });
};
