import { ILogTransporter, ITransporterLogPayload } from '../log.service';

interface IGrafanaLogTransporterOptions {
  hostUrl: string;
}

export class GrafanaLogTransporter implements ILogTransporter {

  public readonly id: string = '@log/grafana';

  constructor(private options: IGrafanaLogTransporterOptions) {
  }

  public transport = (tag: string, message: string, payload: ITransporterLogPayload): void => {
    const timestampNs: number = Date.now() * 1000000;

    fetch(`${this.options.hostUrl}/loki/api/v1/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        streams: [
          {
            stream: { ...payload, tag },
            values: [[timestampNs.toString(), `[${tag}] ${message}`]],
          },
        ],
      }),
    }).catch((error) => {
      console.error('Failed to send logs to Loki:', error);
    });
  };

  public flush = (): void => {
    // no-op
  };
}
