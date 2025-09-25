import { ILogger } from '..';
import { LogService } from '../log.service';
import { GrafanaLogTransporter } from './grafana-log-transporter';

jest.unmock('../log.service');

describe('GrafanaLogTransporter', () => {

  let logger: ILogger;
  let transportFn = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    const grafanaTransporter = new GrafanaLogTransporter({
      transport: transportFn,
      contextProviders: [
        { getContext: jest.fn(() => ({ foo: 'bar' })) },
        { getContext: jest.fn(() => ({ bar: 'baz' })) },
      ],
    });

    const logService = new LogService({
      transporters: [grafanaTransporter],
    });

    logger = logService.createLogger('test');
  });

  it('should transport context from all context providers', () => {
    logger.debug('test');

    expect(transportFn).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: expect.stringContaining('"foo":"bar"'),
      }),
    );

    expect(transportFn).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: expect.stringContaining('"bar":"baz"'),
      }),
    );
  });
});
