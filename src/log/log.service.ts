import { ILogger, ILogLevel, ILogPayload, ILogService } from '.';

export interface ILogServiceOptions {
  flushInterval?: number;
  transporters?: ILogTransporter[];
  defaultLabels?: ILogPayload;
}

export type ITransporterLogPayload = ILogPayload & {
  level: ILogLevel;
};

export interface ILogTransporter {
  readonly id: string;
  transport(tag: string, message: string, options?: ITransporterLogPayload): void;
  flush(): void;
}

export class LogService implements ILogService {

  private transporters: ILogTransporter[] = [];

  private defaultLabels: ILogPayload = {};
  private customLabels: ILogPayload = {};

  constructor(options: ILogServiceOptions = {}) {
    this.transporters = options.transporters || [];
    this.defaultLabels = options.defaultLabels || {};

    const flushInterval: number = options.flushInterval || 0;

    if (flushInterval > 0) {
      setInterval(() => this.flush(), flushInterval);
    }
  }

  public createLogger(tag: string): ILogger {
    return {
      log: (message, level, payload) => this.log(tag, message, level, payload),
      debug: (message, payload) => this.log(tag, message, 'debug', payload),
      info: (message, payload) => this.log(tag, message, 'info', payload),
      warn: (message, payload) => this.log(tag, message, 'warn', payload),
      error: (message, payload) => this.log(tag, message, 'error', payload),
    };
  }

  public addLabel = (key: string, value: string): void => {
    this.customLabels[key] = value;
  };

  public removeLabel = (key: string): void => {
    delete this.customLabels[key];
  };

  public flush = (): void => {
    this.transporters.forEach(t => t.flush());
  };

  private log = (tag: string, message: string, level: ILogLevel, payload: ILogPayload = {}): void => {
    this.transporters.forEach(t => {
      const labels = { ...this.customLabels, ...payload, ...this.defaultLabels, level };
      t.transport(tag, message, labels);
    });
  };

}
