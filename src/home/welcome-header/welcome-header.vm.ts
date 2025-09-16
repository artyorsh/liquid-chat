import { computed } from 'mobx';

import { ISessionService } from '@/auth/session';
import { IPushNotificationService } from '@/push-notification';
import { IRouter } from '@/router';
import { IUserService } from '@/user';

import { IWelcomeHeaderVM } from './welcome-header.component';

export class WelcomeHeaderVM implements IWelcomeHeaderVM {

  constructor(
    private userService: IUserService,
    private pushNotificationService: IPushNotificationService,
    private sessionService: ISessionService,
    private router: IRouter,
  ) {

  }

  @computed public get title(): string {
    return `Hello, ${this.userService.getUser().name}`;
  }

  public viewNotifications = (): void => {
    this.pushNotificationService.authorize();
  };

  public logout = (): void => {
    this.sessionService.logout().then(() => {
      this.router.replace('/welcome');
    }).catch(() => {
      /* no-op */
    });
  };

}
