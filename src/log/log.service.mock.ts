import { ILogService } from '.';

jest.mock('./log.service', () => {
  const logService: ILogService = {
    createLogger: jest.fn(() => ({
      log: jest.fn(m => console.log(m)),
      debug: jest.fn(m => console.debug(m)),
      info: jest.fn(m => console.info(m)),
      warn: jest.fn(m => console.warn(m)),
      error: jest.fn(m => console.error(m)),
    })),
    flush: jest.fn(),
  };

  return {
    LogService: jest.fn().mockImplementation(() => logService),
  };
});
