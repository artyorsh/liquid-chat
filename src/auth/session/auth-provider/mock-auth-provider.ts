import { IAuthenticationProvider, IAuthenticationToken } from '../session.service';

type IMockAuthenticationToken = IAuthenticationToken<{
  token: string;
  refreshToken: string;
}>;

interface IMockAuthenticationProviderConfig {
  resolveMs: number;
  tokenTtl: number;
}

export class MockAuthenticationProvider implements IAuthenticationProvider<IMockAuthenticationToken> {

  constructor(private config: IMockAuthenticationProviderConfig) {}

  public getName(): string {
    return MockAuthenticationProvider.name;
  }

  public async login(_email: string, _password: string): Promise<IMockAuthenticationToken> {
    await this.sleep(this.config.resolveMs);

    return this.createSampleToken();
  }

  public async register(_email: string, _password: string): Promise<IMockAuthenticationToken> {
    await this.sleep(this.config.resolveMs);

    return this.createSampleToken();
  }

  public async refresh(_token: IMockAuthenticationToken): Promise<IMockAuthenticationToken> {
    await this.sleep(this.config.resolveMs);

    return this.createSampleToken();
  }

  private createSampleToken(): IMockAuthenticationToken {
    return {
      provider: 'mock',
      secret: '123',
      expiresAt: Date.now() + this.config.tokenTtl,
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
