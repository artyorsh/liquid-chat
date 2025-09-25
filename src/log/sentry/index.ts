import { ResolutionContext } from 'inversify';

import { ILogTransporter } from '../log.service';
import { SentryLogTransporter } from './sentry-log-transporter';

export const createSentryTransport = (_context: ResolutionContext): ILogTransporter => {
  const dsn: string = process.env.EXPO_PUBLIC_SENTRY_DSN;

  return new SentryLogTransporter({ dsn });
};
