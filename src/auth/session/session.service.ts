import { ILogger } from '@/log';

import { ISession, ISessionService } from '.';

export interface IAuthenticationToken<Payload> {
  provider: string;
  secret: string;
  userId: string;
  expiresAt: number;
  payload: Payload;
}

export type AnyAuthenticationToken = IAuthenticationToken<{}>;

export interface IAuthenticationProvider<Token extends AnyAuthenticationToken = AnyAuthenticationToken> {
  getName(): string;
  login(email: string, password: string): Promise<Token>;
  register(name: string, email: string, password: string): Promise<Token>;
  refresh(token: Token): Promise<Token>;
}

export type AnyAuthenticationProvider = IAuthenticationProvider<AnyAuthenticationToken>;

export interface IAuthenticationStorage<Token extends AnyAuthenticationToken> {
  getToken(): Promise<Token | null>;
  setToken(token: Token): Promise<void>;
  clear(): Promise<void>;
}

export type AnyAuthenticationStorage = IAuthenticationStorage<AnyAuthenticationToken>;

export interface ISessionInitializer {
  initialize(session: ISession): Promise<void>;
  destroy(): Promise<void>;
}

export interface ISessionServiceOptions<Provider extends AnyAuthenticationProvider, Storage extends AnyAuthenticationStorage> {
  tokenRefreshThresholdMinutes: number;
  authenticationProvider: Provider;
  authenticationStorage: Storage;
  initializer: ISessionInitializer;
  logger?: ILogger;
}

export class SessionService implements ISessionService {

  private initializer: ISessionInitializer;

  constructor(private options: ISessionServiceOptions<AnyAuthenticationProvider, AnyAuthenticationStorage>) {
    this.initializer = options.initializer;
  }

  public login = async (email: string, password: string): Promise<ISession> => {
    const token = await this.options.authenticationProvider.login(email, password);
    await this.options.authenticationStorage.setToken(token);

    const session: ISession = this.createSession(token);
    await this.initializer.initialize(session);

    this.options.logger?.info(`login user ${session.userId} via ${this.options.authenticationProvider.getName()}`);

    return session;
  };

  public register = async (name: string, email: string, password: string): Promise<ISession> => {
    const token = await this.options.authenticationProvider.register(name, email, password);
    await this.options.authenticationStorage.setToken(token);

    const session: ISession = this.createSession(token);
    await this.initializer.initialize(session);

    this.options.logger?.info(`register user ${session.userId} via ${this.options.authenticationProvider.getName()}`);

    return session;
  };

  public refresh = async (): Promise<ISession> => {
    const storedToken = await this.options.authenticationStorage.getToken();

    if (!storedToken) {
      const error: string = 'Unable to refresh: no token found';
      this.options.logger?.error(error);

      return Promise.reject(new Error(error));
    }

    const token = await this.options.authenticationProvider.refresh(storedToken);
    await this.options.authenticationStorage.setToken(token);

    const session: ISession = this.createSession(token);
    const expiresInMinutes: number = this.getExpiresInMinutes(token);
    await this.initializer.initialize(session);

    this.options.logger?.info(`refresh for user ${session.userId} via ${this.options.authenticationProvider.getName()}, expires in ${expiresInMinutes} minutes`);

    return session;
  };

  public restore = async (): Promise<ISession> => {
    const storedToken = await this.options.authenticationStorage.getToken();

    if (!storedToken) {
      const error: string = 'Unable to restore: no token found';
      this.options.logger?.error(error);

      return Promise.reject(new Error(error));
    }

    const expiresInMinutes: number = this.getExpiresInMinutes(storedToken);
    const isValidEnough: boolean = expiresInMinutes > this.options.tokenRefreshThresholdMinutes;

    if (!isValidEnough) {
      this.options.logger?.warn(`token expires in less than ${this.options.tokenRefreshThresholdMinutes} minutes, refreshing`);

      return this.refresh();
    }

    const session: ISession = this.createSession(storedToken);
    await this.initializer.initialize(session);

    this.options.logger?.info(`restore for user ${session.userId}, expires in ${expiresInMinutes} minutes`);

    return session;
  };

  public logout = async (): Promise<void> => {
    await this.options.authenticationStorage.clear();
    this.options.logger?.info('logout');

    return this.initializer.destroy();
  };

  private createSession = (token: AnyAuthenticationToken): ISession => {
    return { userId: token.userId, secret: token.secret };
  };

  private getExpiresInMinutes = (token: AnyAuthenticationToken): number => {
    const expiresInMinutes: number = (token.expiresAt - Date.now()) / 60000;

    return Number(expiresInMinutes.toFixed(2));
  };
}
