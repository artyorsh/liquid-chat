import { ResolutionContext } from 'inversify';

import { ILogTransporter } from '../log.service';
import { ConsoleLogTransporter } from './console-log-transporter';

export const createConsoleTransport = (_context: ResolutionContext): ILogTransporter => {
  return new ConsoleLogTransporter();
};
