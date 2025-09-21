import { ILogger } from '@/log';
import { INavigationLifecycleListener, IRoute, IRouter } from '@/router';

import { IPushNotificationService } from '.';
import { NavigationNotificationHandler } from './handlers/navigation-notification-handler';
import { IPushNotificationHandler, IPushPermissionController, IPushServiceProvider, PushNotificationService } from './push-notification.service';

jest.unmock('./push-notification.service');

describe('PushNotificationService', () => {

  let pushServiceProvider: IPushServiceProvider;
  let permissionController: IPushPermissionController;
  let notificationHandlers: IPushNotificationHandler[] = [];
  let logger: ILogger;

  let pushNotificationService: IPushNotificationService;

  beforeEach(() => {
    pushServiceProvider = {
      subscribe: jest.fn(),
      getToken: jest.fn(() => Promise.resolve({ fcm: 'fcm', apns: 'apns' })),
    };

    permissionController = {
      request: jest.fn(() => Promise.resolve()),
      isGranted: jest.fn(() => Promise.resolve(true)),
    };

    notificationHandlers = [
      {
        getName: jest.fn(() => 'ForegroundHandler'),
        handleForeground: jest.fn(() => true),
        handleBackground: jest.fn(() => false),
        handleOpen: jest.fn(() => false),
      },
      {
        getName: jest.fn(() => 'BackgroundHandler'),
        handleForeground: jest.fn(() => false),
        handleBackground: jest.fn(() => true),
        handleOpen: jest.fn(() => false),
      },
      {
        getName: jest.fn(() => 'OpenHandler'),
        handleForeground: jest.fn(() => false),
        handleBackground: jest.fn(() => false),
        handleOpen: jest.fn(() => true),
      },
    ];

    logger = jest.requireMock('@/log/log.service').LogService()
      .createLogger(`[Test] ${PushNotificationService.name}`);

    pushNotificationService = new PushNotificationService(
      pushServiceProvider,
      permissionController,
      notificationHandlers,
      logger,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve authorize if permission is granted', async () => {
    await expect(pushNotificationService.authorize())
      .resolves
      .toEqual(undefined);
  });

  it('should reject authorize with permission denied error', async () => {
    permissionController.request = jest.fn(() => Promise.reject(new Error('Permission denied')));

    pushNotificationService = new PushNotificationService(
      pushServiceProvider,
      permissionController,
      notificationHandlers,
      logger,
    );

    await expect(pushNotificationService.authorize())
      .rejects
      .toThrow('Permission denied');
  });

  it('should handle foreground notifications', () => {
    pushServiceProvider.subscribe = jest.fn((handler: IPushNotificationHandler) => {
      handler.handleForeground({
        id: '1',
        title: 'Test',
        body: 'Test',
        data: {},
      });
    });

    pushNotificationService = new PushNotificationService(
      pushServiceProvider,
      permissionController,
      notificationHandlers,
      logger,
    );

    expect(notificationHandlers[0].handleForeground).toHaveBeenCalled();
  });

  it('should handle background notifications', () => {
    pushServiceProvider.subscribe = jest.fn((handler: IPushNotificationHandler) => {
      handler.handleBackground({
        id: '1',
        title: 'Test',
        body: 'Test',
        data: {},
      });
    });

    pushNotificationService = new PushNotificationService(
      pushServiceProvider,
      permissionController,
      notificationHandlers,
      logger,
    );

    expect(notificationHandlers[1].handleBackground).toHaveBeenCalled();
  });

  it('should handle open notifications', () => {
    pushServiceProvider.subscribe = jest.fn((handler: IPushNotificationHandler) => {
      handler.handleOpen({
        id: '1',
        title: 'Test',
        body: 'Test',
        data: {},
      });
    });

    pushNotificationService = new PushNotificationService(
      pushServiceProvider,
      permissionController,
      notificationHandlers,
      logger,
    );

    expect(notificationHandlers[2].handleOpen).toHaveBeenCalled();
  });

  it('should pass to next handler until handled', () => {
    pushServiceProvider.subscribe = jest.fn((handler: IPushNotificationHandler) => {
      handler.handleForeground({
        id: '1',
        title: 'Test',
        body: 'Test',
        data: {},
      });
    });

    notificationHandlers[0].handleForeground = jest.fn(() => false);
    notificationHandlers[1].handleForeground = jest.fn(() => true);
    notificationHandlers[2].handleForeground = jest.fn(() => false);

    pushNotificationService = new PushNotificationService(
      pushServiceProvider,
      permissionController,
      notificationHandlers,
      logger,
    );

    expect(notificationHandlers[0].handleForeground).toHaveBeenCalled();
    expect(notificationHandlers[1].handleForeground).toHaveBeenCalled();
    expect(notificationHandlers[2].handleForeground).not.toHaveBeenCalled();
  });

  it('should log an error if no handler handled notification', () => {
    pushServiceProvider.subscribe = jest.fn((handler: IPushNotificationHandler) => {
      handler.handleBackground({
        id: '1',
        title: 'Test',
        body: 'Test',
        data: {},
      });
    });

    pushNotificationService = new PushNotificationService(
      pushServiceProvider,
      permissionController,
      [],
      logger,
    );

    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('could not handle notification'));
  });
});

describe('NavigationNotificationHandler', () => {

  let handler: IPushNotificationHandler;
  let router: IRouter;

  beforeEach(() => {
    router = jest.requireMock('@/router/react-navigation/react-navigation-router').RouterService();
    handler = new NavigationNotificationHandler(router);
  });

  it('should not handle notifications without a route', () => {
    const isHandled: boolean = handler.handleOpen({
      id: '1',
      title: 'Test',
      body: 'Test',
      data: {},
    });

    expect(isHandled).toBe(false);
  });

  it('should handle notificatoins with a route', () => {
    const isHandled: boolean = handler.handleOpen({
      id: '1',
      title: 'Test',
      body: 'Test',
      data: { route: '/home' },
    });

    expect(isHandled).toBe(true);
  });

  it('should handle when current route becomes executeWhenRoute', () => {
    const executeWhenRoute: IRoute = '/home';
    const notificationRoute: IRoute = '/welcome';
    const shouldDelayNavigation = (_currentRoute: IRoute): boolean => true;

    const navigationListeners: Record<string, INavigationLifecycleListener> = {};

    const unsubscribeFn = jest.fn();
    router.subscribe = jest.fn((route, listener) => {
      navigationListeners[route] = listener;

      return unsubscribeFn;
    });

    router.navigate = jest.fn(route => {
      navigationListeners[route]?.onFocus();
    });

    handler = new NavigationNotificationHandler(router, {
      executeWhenRoute: executeWhenRoute,
      shouldDelayNavigation: shouldDelayNavigation,
    });

    handler.handleOpen({
      id: '1',
      title: 'Test',
      body: 'Test',
      data: { route: notificationRoute },
    });

    expect(router.navigate).not.toHaveBeenCalled();
    router.navigate(executeWhenRoute);

    const navigationCalls = (router.navigate as jest.Mock).mock.calls;
    const lastNavigationCall = navigationCalls[navigationCalls.length - 1];

    expect(lastNavigationCall).toContain(notificationRoute);
    expect(unsubscribeFn).toHaveBeenCalled();
  });
});
