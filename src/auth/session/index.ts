import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { ILogger, ILogService } from '@/log';

import { MockAuthenticationProvider } from './auth-provider/mock-auth-provider';
import { ISessionModule } from './initialzier';
import { ParallelModuleInitializer } from './initialzier/parallel-module-initializer';
import { SecureAuthStorage } from './secure-auth-storage';
import { IAuthenticationProvider, ISessionInitializer, SessionService } from './session.service';

export interface ISession {
  userId: string;
  secret: string;
}

export interface ISessionService {
  login(email: string, password: string): Promise<ISession>;
  register(name: string, email: string, password: string): Promise<ISession>;
  refresh(): Promise<ISession>;
  restore(): Promise<ISession>;
  logout(): Promise<void>;
}

export const createSessionService = (context: ResolutionContext): ISessionService => {
  const logService: ILogService = context.get(AppModule.LOG);
  const logger: ILogger = logService.createLogger(SessionService.name);

  const userModule: ISessionModule = context.get(AppModule.USER);
  const pushServiceModule: ISessionModule = context.get(AppModule.PUSH_NOTIFICATION);
  const sessionModules: ISessionModule[] = [userModule, pushServiceModule];

  const sessionInitializer: ISessionInitializer = new ParallelModuleInitializer(sessionModules, logger, {
    shouldFailOnModuleFailure: (module: ISessionModule, _error: Error): boolean => {
      return module.moduleIdentifier === 'UserService';
    },
  });

  const authenticationProvider: IAuthenticationProvider = createAuthenticationProvider(context);

  return new SessionService({
    tokenRefreshThresholdMinutes: Number(process.env.EXPO_PUBLIC_AUTH_TOKEN_REFRESH_THRESHOLD_MINUTES) || 0,
    authenticationProvider: authenticationProvider,
    authenticationStorage: new SecureAuthStorage(),
    initializer: sessionInitializer,
    logger: logger,
  });
};

const createAuthenticationProvider = (_context: ResolutionContext): IAuthenticationProvider => {
  const tokenTtlMinutes: number = Number(process.env.EXPO_PUBLIC_AUTH_TOKEN_REFRESH_THRESHOLD_MINUTES) + 1;

  return new MockAuthenticationProvider({
    resolveMs: 1000,
    tokenTtl: tokenTtlMinutes * 60 * 1000,
  });

  // const httpClient: IHttpClient = context.get(AppModule.HTTP);

  // return new HttpAuthenticationProvider(httpClient);
};
