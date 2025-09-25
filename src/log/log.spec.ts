import { ILogger, ILogService } from '.';
import { ConsoleLogTransporter } from './console/console-log-transporter';
import { ILogTransporter, LogService } from './log.service';

jest.unmock('./log.service');

describe('Log Service', () => {

  let logService: ILogService;
  let logger: ILogger;

  let transporter1: ILogTransporter;

  const transporter2: ILogTransporter = {
    id: '@log/fs',
    transport: jest.fn(),
    flush: jest.fn(),
  };

  const TAG: string = 'LogService Tests';
  const testMessage: string = 'Who let the dogs out?';

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    transporter1 = new ConsoleLogTransporter();

    logService = new LogService({
      transporters: [transporter1, transporter2],
    });

    logger = logService.createLogger(TAG);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('logs debug to standard console', () => {
    const spy = jest.spyOn(console, 'log');
    logger.debug(testMessage);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(TAG));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining(testMessage));
  });

  it('logs info to standard console', () => {
    const spy = jest.spyOn(console, 'log');
    logger.debug(testMessage);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(TAG));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining(testMessage));
  });

  it('logs warn to standard console', () => {
    const spy = jest.spyOn(console, 'warn');
    logger.warn(testMessage);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(TAG));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining(testMessage));
  });

  it('logs error to standard console', () => {
    const spy = jest.spyOn(console, 'error');
    logger.error(testMessage);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(TAG));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining(testMessage));
  });

  it('able to log with custom transporter', () => {
    logger.debug(testMessage);
    logger.warn(testMessage);
    logger.error(testMessage);

    expect(transporter2.transport).toHaveBeenCalledWith(
      TAG,
      expect.stringContaining(testMessage),
      expect.objectContaining({ level: 'debug' }),
    );

    expect(transporter2.transport).toHaveBeenCalledWith(
      TAG,
      expect.stringContaining(testMessage),
      expect.objectContaining({ level: 'warn' }),
    );

    expect(transporter2.transport).toHaveBeenCalledWith(
      TAG,
      expect.stringContaining(testMessage),
      expect.objectContaining({ level: 'error' }),
    );
  });

  it('flushes every 50ms', () => {
    logService = new LogService({ flushInterval: 50 });
    logService.flush = jest.fn();

    jest.advanceTimersByTime(200);

    expect(logService.flush).toHaveBeenCalledTimes(4);
  });

  it('does not flush with 0 interval', () => {
    logService = new LogService({ flushInterval: 0, transporters: [transporter2] });
    logService.flush = jest.fn();

    jest.advanceTimersByTime(200);

    expect(logService.flush).toHaveBeenCalledTimes(0);
  });

  it('flushes all transporters', () => {
    transporter1.flush = jest.fn();
    logService.flush();

    expect(transporter1.flush).toHaveBeenCalled();
    expect(transporter2.flush).toHaveBeenCalled();
  });

});
