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
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...config,
        method: 'GET',
        headers: {
          ...this.getDefaultHeaders(),
          ...config.headers,
        },
      });

      const data = await response.json();
      this.options.logger?.debug(`GET ${url} ${JSON.stringify({ status: response.status, data }, null, 2)}`);

      const shouldResolve: boolean = this.options?.shouldResolveStatus?.(response.status) ?? true;

      if (!shouldResolve) {
        throw new Error(response.status.toString());
      }

      return data;
    } catch (error) {
      this.options.logger?.error(`GET ${url} ${error}`);

      throw error;
    }
  }

  public async post<R>(url: string, config: IReqestConfig): Promise<R> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...config,
        method: 'POST',
        headers: {
          ...this.getDefaultHeaders(),
          ...config.headers,
        },
      });

      const data = await response.json();
      this.options.logger?.debug(`POST ${url} ${JSON.stringify({ status: response.status, data }, null, 2)}`);

      const shouldResolve = this.options?.shouldResolveStatus?.(response.status) ?? true;

      if (!shouldResolve) {
        throw new Error(response.status.toString());
      }

      return data;
    } catch (error) {
      this.options.logger?.error(`POST ${url} ${error}`);

      throw error;
    }
  }

  public async put<R>(url: string, config: IReqestConfig): Promise<R> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...config,
        method: 'PUT',
        headers: {
          ...this.getDefaultHeaders(),
          ...config.headers,
        },
      });

      const data = await response.json();
      this.options.logger?.debug(`PUT ${url} ${JSON.stringify({ status: response.status, data }, null, 2)}`);

      const shouldResolve = this.options?.shouldResolveStatus?.(response.status) ?? true;

      if (!shouldResolve) {
        throw new Error(response.status.toString());
      }

      return data;
    } catch (error) {
      this.options.logger?.error(`PUT ${url} ${error}`);

      throw error;
    }
  }

  public async delete<R>(url: string, config: IReqestConfig): Promise<R> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...config,
        method: 'DELETE',
        headers: {
          ...this.getDefaultHeaders(),
          ...config.headers,
        },
      });

      const data = await response.json();
      this.options.logger?.debug(`DELETE ${url} ${JSON.stringify({ status: response.status, data }, null, 2)}`);

      const shouldResolve = this.options?.shouldResolveStatus?.(response.status) ?? true;

      if (!shouldResolve) {
        throw new Error(response.status.toString());
      }

      return data;
    } catch (error) {
      this.options.logger?.error(`DELETE ${url} ${error}`);

      throw error;
    }
  }

  private getDefaultHeaders(): Record<string, string> {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }
}
