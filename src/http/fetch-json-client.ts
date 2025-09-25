import { ILogger } from '@/log';

import { IHttpClient, IReqestConfig } from '.';

export interface IHttpClientOptions {
  logger?: ILogger;
  /**
   * @returns true if the promise should be resolved for the given status.
   */
  shouldResolveStatus?(status: number): boolean;
}

export class FetchJsonClient implements IHttpClient {

  constructor(private baseUrl: string, private options?: IHttpClientOptions) {

  }

  public async get<R>(url: string, config: IReqestConfig): Promise<R> {
    const requestMethod: RequestInit['method'] = 'GET';

    try {
      const [response, data] = await this.fetchJson<R>(url, requestMethod, config);

      this.logResponse(url, requestMethod, response, data);
      this.assertShouldResolve(response.status);

      return data;
    } catch (error) {
      this.options.logger?.error(`${requestMethod} ${url} ${error}`);

      throw error;
    }
  }

  public async post<R>(url: string, config: IReqestConfig): Promise<R> {
    const requestMethod: RequestInit['method'] = 'POST';

    try {
      const [response, data] = await this.fetchJson<R>(url, requestMethod, config);

      this.logResponse(url, requestMethod, response, data);
      this.assertShouldResolve(response.status);

      return data;
    } catch (error) {
      this.logError(url, requestMethod, error);

      throw error;
    }
  }

  public async put<R>(url: string, config: IReqestConfig): Promise<R> {
    const requestMethod: RequestInit['method'] = 'PUT';

    try {
      const [response, data] = await this.fetchJson<R>(url, requestMethod, config);

      this.logResponse(url, requestMethod, response, data);
      this.assertShouldResolve(response.status);

      return data;
    } catch (error) {
      this.logError(url, requestMethod, error);

      throw error;
    }
  }

  public async delete<R>(url: string, config: IReqestConfig): Promise<R> {
    const requestMethod: RequestInit['method'] = 'DELETE';

    try {
      const [response, data] = await this.fetchJson<R>(url, requestMethod, config);

      this.logResponse(url, requestMethod, response, data);
      this.assertShouldResolve(response.status);

      return data;
    } catch (error) {
      this.logError(url, requestMethod, error);

      throw error;
    }
  }

  private async fetchJson<R>(path: string, method: RequestInit['method'], config: IReqestConfig): Promise<[Response, R]> {
    const response: Response = await fetch(`${this.baseUrl}${path}`, {
      ...config,
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    const data: R = await response.json();

    return [response, data];
  }

  private assertShouldResolve(status: number): void | never {
    const shouldResolve: boolean = this.options.shouldResolveStatus?.(status) ?? true;

    if (!shouldResolve) {
      throw new Error(status.toString());
    }
  }

  private logResponse(url: string, requestMethod: RequestInit['method'], response: Response, data: any): void {
    this.options.logger?.debug(`${requestMethod} ${url} ${JSON.stringify({ status: response.status, data }, null, 2)}`);
  }

  private logError(url: string, requestMethod: RequestInit['method'], error: Error): void {
    this.options.logger?.error(`${requestMethod} ${url} ${error}`);
  }
}
