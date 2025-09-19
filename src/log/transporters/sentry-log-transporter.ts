import * as Sentry from '@sentry/react-native';

import { ILogTransporter, ITransporterLogPayload } from '../log.service';

export type ISentryLogTransporterConfig = Omit<Sentry.ReactNativeOptions, 'enableLogs'>;

export class SentryLogTransporter implements ILogTransporter {

  public readonly id: string = '@log/sentry';

  constructor(config: ISentryLogTransporterConfig) {
    Sentry.init({
      ...config,
      enableLogs: true,
    });
  }

  public transport(tag: string, message: string, payload: ITransporterLogPayload): void {
    switch (payload.level) {
      case 'debug':
        Sentry.logger.debug(`[${tag}] ${message}`, payload);
        break;

      case 'info':
        Sentry.logger.info(`[${tag}] ${message}`, payload);
        break;

      case 'warn':
        Sentry.logger.warn(`[${tag}] ${message}`, payload);
        break;

      case 'error':
        Sentry.logger.error(`[${tag}] ${message}`, payload);
        break;

      default:
        console.warn(SentryLogTransporter.name, 'Unable to transport log with ', payload.level);
    }
  }

  public flush(): void {
    Sentry.flush();
  }
}
