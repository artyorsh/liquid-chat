import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { ILogService } from '@/log';

import { FetchJsonClient } from './fetch-json-client';

export type IReqestConfig = Omit<RequestInit, 'method'>;

export interface IHttpClient {
  get<R>(url: string, config: IReqestConfig): Promise<R>;
  post<R>(url: string, config: IReqestConfig): Promise<R>;
  put<R>(url: string, config: IReqestConfig): Promise<R>;
  delete<R>(url: string, config: IReqestConfig): Promise<R>;
}

export const HttpModule = new ContainerModule(({ bind }) => {
  bind<IHttpClient>(AppModule.HTTP)
    .toDynamicValue((context) => createHttpClient(context))
    .inSingletonScope();
});

const createHttpClient = (context: ResolutionContext): IHttpClient => {
  const baseUrl: string = process.env.EXPO_PUBLIC_HTTP_BASE_URL;
  const logService: ILogService = context.get(AppModule.LOG);

  return new FetchJsonClient(baseUrl, {
    logger: logService.createLogger(FetchJsonClient.name),
    shouldResolveStatus: (status) => status >= 200 && status < 300,
  });
};
