import { IRoute, IRouter } from '@/router';

import { IPushNotification, IPushNotificationHandler } from '../push-notification.service';

type INavigationNotification = IPushNotification<{ route: string }>;

interface INavigationNotificationHandlerOptions {
  /**
   * The route to await to perform navigation, if shouldDelayNavigation returned true.
   */
  executeWhenRoute: IRoute;
  shouldDelayNavigation(currentRoute: IRoute): boolean;
}

export class NavigationNotificationHandler implements IPushNotificationHandler {

  constructor(private router: IRouter, private options?: INavigationNotificationHandlerOptions) {
  }

  public getName(): string {
    return NavigationNotificationHandler.name;
  };

  /**
   * no-op: the notification is handled by system, presenting it in notification center
   */
  public handleForeground(notification: IPushNotification): boolean {
    return this.isSupportedNotification(notification);
  }

  /**
   * no-op: the notification is handled by system, presenting it in notification center
   */
  public handleBackground(notification: IPushNotification): boolean {
    return this.isSupportedNotification(notification);
  }

  /**
   * Navigates to the route specified in {notification.data.route}
   */
  public handleOpen(notification: IPushNotification): boolean {
    if (!this.isSupportedNotification(notification)) {
      return false;
    }

    const { route, ...params } = notification.data;

    const currentRoute: IRoute = this.router.getCurrentRoute();
    const shouldDelayNavigation: boolean = this.options?.shouldDelayNavigation(currentRoute);

    if (!shouldDelayNavigation) {
      this.router.navigate(route as IRoute, params);

      return true;
    }

    const whenRouteSubscription = this.router.subscribe(this.options.executeWhenRoute, {
      onFocus: () => {
        this.router.navigate(route as IRoute, params);
        whenRouteSubscription();
      },
    });

    return true;
  }

  private isSupportedNotification(notification: IPushNotification): notification is INavigationNotification {
    return !!notification.data?.route;
  }
}
