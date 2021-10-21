import { LogBox } from 'react-native';

import { ILogOptions, ILogTransporter } from '../log.service';

export class ConsoleLogTransporter implements ILogTransporter {

  private get currentTime(): string {
    const now: Date = new Date();
    const hours: string = now.getHours().toString().padStart(2, '0');
    const minutes: string = now.getMinutes().toString().padStart(2, '0');
    const seconds: string = now.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  public readonly id: string = '@log/console';

  constructor() {
    LogBox.ignoreAllLogs();
  }

  public transport = (tag: string, message: string, options?: ILogOptions): void => {
    switch (options?.level || 'debug') {
      case 'warn':
        return console.warn(`\x1b[33m[${this.currentTime}] \x1b[1m${tag} \x1b[0m${message}`);

      case 'error':
        return console.error(`\x1b[31;1m[${this.currentTime}] \x1b[1m${tag} \x1b[0m${message}`);

      default:
        return console.log(`\x1b[34m[${this.currentTime}] \x1b[1m${tag} \x1b[0m${message}`);
    }
  };

  public flush = (): void => {
    // no-op
  };
}
