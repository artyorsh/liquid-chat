import { IHttpClient } from '@/http';

import { IAuthenticationProvider, IAuthenticationToken } from '../session.service';

type HttpAuthToken = IAuthenticationToken<IAuthResponse>;

interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  userId: string;
}

export class HttpAuthenticationProvider implements IAuthenticationProvider<HttpAuthToken> {

  constructor(private readonly httpClient: IHttpClient) {

  }

  public getName(): string {
    return HttpAuthenticationProvider.name;
  }

  public async login(email: string, password: string): Promise<HttpAuthToken> {
    const body: string = JSON.stringify({ email, password });
    const response: IAuthResponse = await this.httpClient.post('/auth/login', { body });

    return this.createToken(response);
  }

  public async register(email: string, password: string): Promise<HttpAuthToken> {
    const body: string = JSON.stringify({ email, password });
    const response: IAuthResponse = await this.httpClient.post('/auth/register', { body });

    return this.createToken(response);
  }

  public async refresh(token: HttpAuthToken): Promise<HttpAuthToken> {
    const body: string = JSON.stringify({ refreshToken: token.payload.refreshToken });
    const response: IAuthResponse = await this.httpClient.post('/auth/refresh', { body });

    return this.createToken(response);
  }

  private createToken(token: IAuthResponse): HttpAuthToken {
    return {
      provider: 'http',
      secret: token.accessToken,
      userId: token.userId,
      expiresAt: Date.now() + token.accessTokenExpiresIn,
      payload: token,
    };
  }
}
