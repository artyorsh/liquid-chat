import { ILogger } from '@/log';

import { ISessionModule } from './initialzier';
import { IParallelModuleInitializerOptions, ParallelModuleInitializer } from './initialzier/parallel-module-initializer';
import { AnyAuthenticationProvider, AnyAuthenticationStorage, AnyAuthenticationToken, ISessionInitializer, SessionService } from './session.service';

jest.unmock('./session.service');

describe('SessionService', () => {

  const TWO_MINUTES_MS: number = 2 * 60 * 1000;

  const createToken = (validMs: number): AnyAuthenticationToken => ({
    provider: 'local',
    secret: '123',
    userId: '1',
    expiresAt: Date.now() + validMs,
    payload: {},
  });

  let authenticationProvider: AnyAuthenticationProvider;

  let authenticationStorage: AnyAuthenticationStorage;

  let sessionInitializer: ISessionInitializer;

  let sessionService: SessionService;

  beforeEach(() => {
    authenticationProvider = {
      getName: jest.fn(() => 'local'),
      login: jest.fn(() => Promise.resolve(createToken(TWO_MINUTES_MS))),
      register: jest.fn(() => Promise.resolve(createToken(TWO_MINUTES_MS))),
      refresh: jest.fn(() => Promise.resolve(createToken(TWO_MINUTES_MS))),
    };

    authenticationStorage = {
      getToken: jest.fn(() => Promise.resolve(null)),
      setToken: jest.fn(() => Promise.resolve()),
      clear: jest.fn(() => Promise.resolve()),
    };

    sessionInitializer = {
      initialize: jest.fn(() => Promise.resolve()),
      destroy: jest.fn(() => Promise.resolve()),
    };

    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage,
      initializer: sessionInitializer,
      tokenRefreshThresholdMinutes: 1,
    });
  });

  it('should login', async () => {
    await expect(sessionService.login('test@test.com', 'password'))
      .resolves
      .toEqual({ userId: '1', secret: '123' });
  });

  it('should register', async () => {
    await expect(sessionService.register('User', 'test@test.com', 'password'))
      .resolves
      .toEqual({ userId: '1', secret: '123' });
  });

  it('should refresh with stored token', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage: {
        ...authenticationStorage,
        getToken: () => Promise.resolve(createToken(TWO_MINUTES_MS)),
      },
      initializer: sessionInitializer,
      tokenRefreshThresholdMinutes: 1,
    });

    await expect(sessionService.refresh())
      .resolves
      .toEqual({ userId: '1', secret: '123' });
  });

  it('should not refresh without stored token', async () => {
    await expect(sessionService.refresh())
      .rejects
      .toThrow();
  });

  it('should restore with refreshing expiring token', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage: {
        ...authenticationStorage,
        getToken: () => Promise.resolve(createToken(TWO_MINUTES_MS)),
      },
      initializer: sessionInitializer,
      tokenRefreshThresholdMinutes: 2,
    });

    await expect(sessionService.restore())
      .resolves
      .toEqual({ userId: '1', secret: '123' });

    expect(authenticationProvider.refresh)
      .toHaveBeenCalled();
  });

  it('should restore without refreshing token', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage: {
        ...authenticationStorage,
        getToken: () => Promise.resolve(createToken(TWO_MINUTES_MS)),
      },
      initializer: sessionInitializer,
      tokenRefreshThresholdMinutes: 1,
    });

    await expect(sessionService.restore())
      .resolves
      .toEqual({ userId: '1', secret: '123' });

    expect(authenticationProvider.refresh)
      .not
      .toHaveBeenCalled();
  });

  it('should not restore without stored token', async () => {
    await expect(sessionService.restore())
      .rejects
      .toThrow();
  });

  it('should clear storage on logout', async () => {
    await expect(sessionService.logout())
      .resolves
      .toBeUndefined();

    expect(authenticationStorage.clear)
      .toHaveBeenCalled();
  });

  it('should invoke initializer on login', async () => {
    await sessionService.login('test@test.com', 'password');

    expect(sessionInitializer.initialize)
      .toHaveBeenCalledWith({ userId: '1', secret: '123' });
  });

  it('should initialize modules on register', async () => {
    await sessionService.register('User', 'test@test.com', 'password');

    expect(sessionInitializer.initialize)
      .toHaveBeenCalledWith({ userId: '1', secret: '123' });
  });

  it('should initialize modules on refresh', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage: {
        ...authenticationStorage,
        getToken: () => Promise.resolve(createToken(TWO_MINUTES_MS)),
      },
      initializer: sessionInitializer,
      tokenRefreshThresholdMinutes: 1,
    });

    await sessionService.refresh();

    expect(sessionInitializer.initialize)
      .toHaveBeenCalledWith({ userId: '1', secret: '123' });
  });

  it('should initialize modules on restore', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage: {
        ...authenticationStorage,
        getToken: () => Promise.resolve(createToken(TWO_MINUTES_MS)),
      },
      initializer: sessionInitializer,
      tokenRefreshThresholdMinutes: 1,
    });

    await sessionService.restore();

    expect(sessionInitializer.initialize)
      .toHaveBeenCalledWith({ userId: '1', secret: '123' });
  });

  it('should reject login if initializer fails to initialize', async () => {
    sessionInitializer = {
      initialize: jest.fn(() => Promise.reject(new Error('Test error'))),
      destroy: jest.fn(() => Promise.resolve()),
    };

    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage,
      initializer: sessionInitializer,
      tokenRefreshThresholdMinutes: 1,
    });

    await expect(sessionService.login('test@test.com', 'password'))
      .rejects
      .toThrow('Test error');
  });

  it('should invoke initializer destroy on logout', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage,
      initializer: sessionInitializer,
      tokenRefreshThresholdMinutes: 1,
    });

    await sessionService.logout();

    expect(sessionInitializer.destroy)
      .toHaveBeenCalled();
  });

  it('should reject logout if initializer fails to destroy', async () => {
    sessionInitializer = {
      initialize: jest.fn(() => Promise.resolve()),
      destroy: jest.fn(() => Promise.reject(new Error('Test error'))),
    };

    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage,
      initializer: sessionInitializer,
      tokenRefreshThresholdMinutes: 1,
    });

    await expect(sessionService.logout())
      .rejects
      .toThrow('Test error');
  });
});

describe('ParallelModuleInitializer', () => {

  let modules: ISessionModule[];

  let logger: ILogger;

  let options: IParallelModuleInitializerOptions;

  const createSessionModule = (identifier: string, delay: number): ISessionModule => ({
    moduleIdentifier: identifier,
    initialize: jest.fn(() => {
      return new Promise(resolve => {
        setTimeout(resolve, delay);
      });
    }),
    destroy: jest.fn(() => Promise.resolve()),
  });

  beforeEach(() => {
    modules = [
      createSessionModule('50ms', 50),
      createSessionModule('10ms', 10),
      createSessionModule('30ms', 30),
    ];
    logger = jest.requireMock('@/log/log.service').LogService()
      .createLogger(`[Test] ${SessionService.name}`);

    options = {
      shouldFailOnModuleFailure: (): boolean => false,
    };

    jest.clearAllMocks();
  });

  it('should invoke initialize on all modules', async () => {
    const initializer = new ParallelModuleInitializer(modules, logger, options);
    await initializer.initialize({ userId: '1', secret: '123' });

    expect(modules[0].initialize)
      .toHaveBeenCalled();

    expect(modules[1].initialize)
      .toHaveBeenCalled();
  });

  it('should initialize modules in parallel, regardless of their order in the array', async () => {
    const startTime = Date.now();

    const initializer = new ParallelModuleInitializer(modules, logger, options);
    await initializer.initialize({ userId: '1', secret: '123' });

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // We expect parallel execution, so it should be:
    // parallel_time (min 50ms) < X < sequential_time (90ms)
    expect(totalTime).toBeLessThan(80);
  });

  it('should reject if any module fails to initialize', async () => {
    options.shouldFailOnModuleFailure = (): boolean => true;
    modules[0].initialize = jest.fn(() => Promise.reject(new Error('Test error')));

    const initializer = new ParallelModuleInitializer(modules, logger, options);

    await expect(initializer.initialize({ userId: '1', secret: '123' }))
      .rejects
      .toThrow('Test error');
  });
});
