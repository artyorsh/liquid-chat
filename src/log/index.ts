import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di/model';

import { ILogTransporter, LogService } from './log.service';
import { ConsoleLogTransporter } from './transporters/console-log-transporter';
import { FileLogTransporter } from './transporters/file-log-transporter';
import { GrafanaLogTransporter } from './transporters/grafana-log-transporter';

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

export const LogModule = new ContainerModule(bind => {
  bind<ILogService>(AppModule.LOG)
    .toDynamicValue(context => createLogger(context))
    .inSingletonScope();
});

const createLogger = (_context: interfaces.Context): ILogService => {
  const grafanaAppId: string = `rnapp_${Platform.OS}_${process.env.EXPO_PUBLIC_ENV_NAME}`;

  const deviceName: string = Device.deviceName;
  const deviceModel: string = Device.modelName;
  const deviceBrand: string = Device.brand;
  const systemVersion: string = Device.osVersion;
  const appVersion: string = `${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`;

  const transporters: ILogTransporter[] = createTransporters();

  return new LogService({
    flushInterval: 10_000,
    defaultLabels: {
      app: grafanaAppId,
      version: appVersion,
      runtime: `${deviceName}/${Platform.OS}/${systemVersion}/${deviceBrand}/${deviceModel}`,
    },
    transporters: transporters,
  });
};

export const createTransporters = (): ILogTransporter[] => {
  const transporterIds: string[] = process.env.EXPO_PUBLIC_LOG_TRANSPORTS.split(',');
  const result: ILogTransporter[] = [];

  transporterIds.forEach(transporterId => {
    switch (transporterId) {
      case 'console':
        const consoleTransporter: ILogTransporter = new ConsoleLogTransporter();
        result.push(consoleTransporter);

        break;

      case 'file':
        const fileName: string = process.env.EXPO_PUBLIC_LOG_FILE_NAME;
        const fileTransporter: ILogTransporter = new FileLogTransporter(fileName);
        result.push(fileTransporter);

        break;

      case 'grafana':
        const hostUrl: string = process.env.EXPO_PUBLIC_GRAFANA_HOST;
        const grafanaTransporter: ILogTransporter = new GrafanaLogTransporter({ hostUrl });
        result.push(grafanaTransporter);

        break;

      default:
        console.error(`Unsupported transporter identifier: ${transporterId}. Check EXPO_PUBLIC_LOG_TRANSPORTS`);
    }
  });

  return result;
};
