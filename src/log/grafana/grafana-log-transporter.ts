import { ILogTransporter, ITransporterLogPayload } from '../log.service';

export interface IGrafanaLogTransporterConfig {
  transport(url: string, options: RequestInit): Promise<any>;
  contextProviders?: IGrafanaLogContextProvider[];
}

export interface IGrafanaLogContextProvider {
  getContext(): IGrafanaLogContext;
}

export type IGrafanaLogContext = Record<string, string | number>;

export class GrafanaLogTransporter implements ILogTransporter {

  public readonly id: string = '@log/grafana';

  constructor(private config: IGrafanaLogTransporterConfig) {
  }

  public transport = (tag: string, message: string, payload: ITransporterLogPayload): void => {
    const timestampNs: number = Date.now() * 1_000_000;
    const context: IGrafanaLogContext = this.getLogContext();

    const request: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        streams: [
          {
            stream: { ...payload, ...context, tag },
            values: [[timestampNs.toString(), `[${tag}] ${message}`]],
          },
        ],
      }),
    };

    this.config.transport('loki/api/v1/push', request)
      .catch(error => console.error('Failed to send logs to Grafana:', error));
  };

  public flush = (): void => {
    // no-op
  };

  private getLogContext(): IGrafanaLogContext {
    const contextProviders: IGrafanaLogContextProvider[] = this.config.contextProviders || [];

    return contextProviders
      .reduce((acc, provider) => ({ ...acc, ...provider.getContext() }), {});
  }
}
