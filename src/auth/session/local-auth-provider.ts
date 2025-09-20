import { IAuthenticationProvider, IAuthenticationToken } from './session.service';

type ILocalAuthenticationToken = IAuthenticationToken<{
  token: string;
  refreshToken: string;
}>;

export class LocalAuthenticationProvider implements IAuthenticationProvider<ILocalAuthenticationToken> {

  private static SLEEP_MS: number = 1000;

  public async login(_email: string, _password: string): Promise<ILocalAuthenticationToken> {
    await this.sleep(LocalAuthenticationProvider.SLEEP_MS);

    return this.createSampleToken();
  }

  public async register(_email: string, _password: string): Promise<ILocalAuthenticationToken> {
    await this.sleep(LocalAuthenticationProvider.SLEEP_MS);

    return this.createSampleToken();
  }

  public async refresh(_token: ILocalAuthenticationToken): Promise<ILocalAuthenticationToken> {
    await this.sleep(LocalAuthenticationProvider.SLEEP_MS);

    return this.createSampleToken();
  }

  private createSampleToken(): ILocalAuthenticationToken {
    const fifteenMinutesInMs: number = 15 * 60 * 1000;

    return {
      provider: 'auth-api',
      secret: '123',
      expiresAt: Date.now() + fifteenMinutesInMs,
      userId: '1',
      payload: {
        token: '123',
        refreshToken: '456',
      },
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
