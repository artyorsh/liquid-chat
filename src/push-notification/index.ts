import Constants from 'expo-constants';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di';
import { ILogger, ILogService } from '@/log';
import { IRouter } from '@/router';

import { MockPushPermissionController } from './expo-go-compat/mock-push-permission-controller';
import { MockPushServiceProvider } from './expo-go-compat/mock-push-service-provider';
import { NavigationNotificationHandler } from './handlers/navigation-notification-handler';
import { NotificationRemoveHandler } from './handlers/notification-remove-handler';
import { IPushNotificationHandler, IPushPermissionController, IPushServiceProvider, PushNotificationService } from './push-notification.service';

export interface IPushNotificationService {
  /**
   * Requests notification permission and subscribes for Push Notification events.
   * @returns a resolved promise if subscribed successfully, rejected otherwise
   */
  authorize(): Promise<void>;
}

export const PushNotificationModule = new ContainerModule(bind => {
  bind<IPushNotificationService>(AppModule.PUSH_NOTIFICATION)
    .toDynamicValue(context => createPushNotificationService(context))
    .inSingletonScope();
});

const createPushNotificationService = (context: interfaces.Context): IPushNotificationService => {
  const isExpoGo: boolean = Constants.executionEnvironment === 'storeClient';

  const router: IRouter = context.container.get(AppModule.ROUTER);
  const logService: ILogService = context.container.get(AppModule.LOG);
  const logger: ILogger = logService.createLogger(PushNotificationService.name);

  let pushServiceProvider: IPushServiceProvider = new MockPushServiceProvider();
  let pushPermissionController: IPushPermissionController = new MockPushPermissionController();

  if (!isExpoGo) {
    const { RNFBPushServiceProvider } = require('./rnfb/rnfb-push-service-provider');
    const { RNFBPushPermissionController } = require('./rnfb/rnfb-push-permission-controller');

    pushServiceProvider = new RNFBPushServiceProvider({
      initialNotificationPollInterval: 1000,
      shouldHandleInitialNotification: () => true,
    });

    pushPermissionController = new RNFBPushPermissionController({
      alert: true,
      badge: true,
      sound: true,
    });
  }

  const handlers: IPushNotificationHandler[] = [
    new NavigationNotificationHandler(router),
    new NotificationRemoveHandler(),
  ];

  return new PushNotificationService(
    pushServiceProvider,
    pushPermissionController,
    handlers,
    logger,
  );
};
