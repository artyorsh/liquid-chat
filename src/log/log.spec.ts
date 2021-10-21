import { ILogger, ILogService } from '.';
import { ILogTransporter, LogService } from './log.service';
import { ConsoleLogTransporter } from './transporters/console-log-transporter';

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

  it('should add default labels to all logs', () => {
    logService = new LogService({
      defaultLabels: { app: 'test', version: '1.0.0' },
      transporters: [transporter2],
    });

    const testLogger: ILogger = logService.createLogger(TAG);
    testLogger.debug('test');

    expect(transporter2.transport).toHaveBeenCalledWith(
      TAG,
      'test',
      expect.objectContaining({ app: 'test', version: '1.0.0' }),
    );
  });

  it('should add custom labels', () => {
    logService = new LogService({
      defaultLabels: { app: 'test', version: '1.0.0' },
      transporters: [transporter2],
    });

    logService.addLabel('user_id', '123');

    const testLogger: ILogger = logService.createLogger(TAG);

    testLogger.debug('test');

    expect(transporter2.transport).toHaveBeenCalledWith(
      TAG,
      'test',
      expect.objectContaining({ user_id: '123' }),
    );
  });

  it('should not override default labels with custom labels', () => {
    logService = new LogService({
      defaultLabels: { app: 'test' },
      transporters: [transporter2],
    });

    logService.addLabel('app', 'test2');

    const testLogger: ILogger = logService.createLogger(TAG);

    testLogger.debug('test');

    expect(transporter2.transport).toHaveBeenCalledWith(
      TAG,
      'test',
      expect.objectContaining({ app: 'test' }),
    );
  });

  it('should not override default labels with payload labels', () => {
    logService = new LogService({
      defaultLabels: { app: 'test' },
      transporters: [transporter2],
    });

    const testLogger: ILogger = logService.createLogger(TAG);
    testLogger.debug('test', { app: 'test2', level: 'warn' });

    expect(transporter2.transport).toHaveBeenCalledWith(
      TAG,
      'test',
      expect.objectContaining({ app: 'test', level: 'debug' }),
    );
  });

  it('should not remove default labels', () => {
    logService = new LogService({
      defaultLabels: { app: 'test', version: '1.0.0' },
      transporters: [transporter2],
    });

    logService.removeLabel('app');

    const testLogger: ILogger = logService.createLogger(TAG);

    testLogger.debug('test');

    expect(transporter2.transport).toHaveBeenCalledWith(
      TAG,
      'test',
      expect.objectContaining({ app: 'test' }),
    );
  });

  it('should remove custom labels', () => {
    logService = new LogService({
      defaultLabels: { app: 'test', version: '1.0.0' },
      transporters: [transporter2],
    });

    logService.addLabel('user_id', '123');
    logService.removeLabel('user_id');

    const testLogger: ILogger = logService.createLogger(TAG);

    testLogger.debug('test');

    expect(transporter2.transport).toHaveBeenCalledWith(
      TAG,
      'test',
      expect.not.objectContaining({ user_id: '123' }),
    );
  });

  it('flushes all transporters', () => {
    transporter1.flush = jest.fn();
    logService.flush();

    expect(transporter1.flush).toHaveBeenCalled();
    expect(transporter2.flush).toHaveBeenCalled();
  });

});

