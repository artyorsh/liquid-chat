import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';

import { createConsoleTransport } from './console';
import { createFileTransport } from './file';
import { createGrafanaTransport } from './grafana';
import { ILogTransporter, LogService } from './log.service';
import { createSentryTransport } from './sentry';

export type ILogLevel =
 | 'debug'
 | 'info'
 | 'warn'
 | 'error';

export type ILogPayload = Record<string, string>;

export interface ILogger {
  log(message: string, level: ILogLevel, payload?: ILogPayload): void;
  debug(message: string, payload?: ILogPayload): void;
  info(message: string, payload?: ILogPayload): void;
  warn(message: string, payload?: ILogPayload): void;
  error(message: string, payload?: ILogPayload): void;
}

export interface ILogService {
  createLogger(tag: string): ILogger;
  addLabel(key: string, value: string): void;
  removeLabel(key: string): void;
  flush(): void;
}

export const LogModule = new ContainerModule(({ bind }) => {
  bind<ILogService>(AppModule.LOG)
    .toDynamicValue(context => createLogger(context))
    .inSingletonScope();
});

const createLogger = (context: ResolutionContext): ILogService => {
  const deviceName: string = Device.deviceName;
  const deviceModel: string = Device.modelName;
  const deviceBrand: string = Device.brand;
  const systemVersion: string = Device.osVersion;
  const appVersion: string = `${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`;

  const transporters: ILogTransporter[] = createTransporters(context);
  const flushInterval: number = parseInt(process.env.EXPO_PUBLIC_LOG_FLUSH_INTERVAL);

  return new LogService({
    flushInterval: flushInterval,
    defaultLabels: {
      app: Application.applicationId,
      os: Platform.OS,
      version: appVersion,
      runtime: `${deviceName}/${Platform.OS}/${systemVersion}/${deviceBrand}/${deviceModel}`,
    },
    transporters: transporters,
  });
};

export const createTransporters = (context: ResolutionContext): ILogTransporter[] => {
  const transporterIds: string[] = process.env.EXPO_PUBLIC_LOG_TRANSPORTS.split(',');
  const result: ILogTransporter[] = [];

  transporterIds.forEach(transporterId => {
    switch (transporterId) {
      case 'console':
        const consoleTransporter: ILogTransporter = createConsoleTransport(context);
        result.push(consoleTransporter);

        break;

      case 'file':
        const fileTransporter: ILogTransporter = createFileTransport(context);
        result.push(fileTransporter);

        break;

      case 'grafana':
        const grafanaTransporter: ILogTransporter = createGrafanaTransport(context);
        result.push(grafanaTransporter);

        break;

      case 'sentry':
        const sentryTransporter: ILogTransporter = createSentryTransport(context);
        result.push(sentryTransporter);

        break;

      default:
        console.error(`Unsupported transporter identifier: ${transporterId}. Check EXPO_PUBLIC_LOG_TRANSPORTS`);
    }
  });

  return result;
};
