import { ISession } from '@/auth/session';
import { ISessionModule } from '@/auth/session/initialzier';
import { ILogger } from '@/log';

import { IPushNotificationService } from '.';

export interface IPushNotification<Payload = any> {
  id: string;
  title: string;
  body: string;
  data: Payload;
}

export interface IPushNotificationToken {
  fcm: string | null;
  apns: string | null;
}

export interface IPushNotificationHandler {
  getName(): string;
  /**
   * @returns {true} if notification was handled, {false} otherwise
   */
  handleForeground(notification: IPushNotification): boolean;
  /**
   * @returns {true} if notification was handled, {false} otherwise
   */
  handleBackground(notification: IPushNotification): boolean;
  /**
   * @returns {true} if notification was handled, {false} otherwise
   */
  handleOpen(notification: IPushNotification): boolean;
}

export interface IPushServiceProvider {
  subscribe(handler: IPushNotificationHandler): void;
  getToken(): Promise<IPushNotificationToken>;
}

export interface IPushPermissionController {
  isGranted(): Promise<boolean>;
  request(): Promise<void>;
}

export class PushNotificationService implements IPushNotificationService, IPushNotificationHandler, ISessionModule {

  public readonly moduleIdentifier: string = PushNotificationService.name;

  constructor(
    private provider: IPushServiceProvider,
    private permissionController: IPushPermissionController,
    private handlers: IPushNotificationHandler[],
    private logger: ILogger,
  ) {
    this.provider.subscribe(this);
  }

  public authorize = async (): Promise<void> => {
    await this.permissionController.request();
    const token = await this.provider.getToken();

    this.logger.debug(`registered token: ${JSON.stringify(token, null, 2)}`);
  };

  // IPushNotificationHandler

  public getName = (): string => {
    return this.moduleIdentifier;
  };

  public handleForeground = (notification: IPushNotification): boolean => {
    const handler: IPushNotificationHandler | undefined = this.handlers.find(i => i.handleForeground?.(notification));
    this.logNotificationHandled(notification, handler?.getName());

    return !!handler;
  };

  public handleBackground = (notification: IPushNotification): boolean => {
    const handler: IPushNotificationHandler | undefined = this.handlers.find(i => i.handleBackground?.(notification));
    this.logNotificationHandled(notification, handler?.getName());

    return !!handler;
  };

  public handleOpen = (notification: IPushNotification): boolean => {
    const handler: IPushNotificationHandler | undefined = this.handlers.find(i => i.handleOpen?.(notification));
    this.logNotificationHandled(notification, handler?.getName());

    return !!handler;
  };

  // ISessionInitializer

  public initialize = async (_session: ISession): Promise<void> => {
    const granted = await this.permissionController.isGranted();

    if (granted) {
      return this.authorize();
    }
  };

  public destroy = (): Promise<void> => {
    /* no-op */
    return Promise.resolve();
  };

  private logNotificationHandled = (notification: IPushNotification, handlerName?: string): void => {
    if (handlerName) {
      this.logger.debug(`handled notification with ${handlerName}, id: ${notification.id}`);
    } else {
      this.logger.error(`could not handle notification, id: ${notification.id}, payload: ${JSON.stringify(notification.data, null, 2)}`);
    }
  };
}
