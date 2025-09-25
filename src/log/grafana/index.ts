import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IUserService } from '@/user';

import { ILogTransporter } from '../log.service';
import { AppContextProvider } from './context-provider/app-context-provider';
import { UserContextProvider } from './context-provider/user-context-provider';
import { GrafanaLogTransporter } from './grafana-log-transporter';

export const createGrafanaTransport = (context: ResolutionContext): ILogTransporter => {
  const hostUrl: string = process.env.EXPO_PUBLIC_LOG_GRAFANA_HOST;
  const userService: IUserService = context.get(AppModule.USER);

  return new GrafanaLogTransporter({
    transport: (path, request) => fetch(`${hostUrl}/${path}`, request),
    contextProviders: [
      new AppContextProvider(),
      new UserContextProvider(userService),
    ],
  });
};
