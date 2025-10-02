import { action, computed, makeAutoObservable, observable } from 'mobx';

import { ISessionService } from '@/auth/session';
import { IPushNotificationService } from '@/push-notification';
import { IRouter } from '@/router';
import { IUser, IUserService } from '@/user';

import { IWelcomeHeaderVM } from './welcome-header.component';

export class WelcomeHeaderVM implements IWelcomeHeaderVM {

  @observable public unreadNotifications: number = 2;

  constructor(
    private userService: IUserService,
    private pushNotificationService: IPushNotificationService,
    private sessionService: ISessionService,
    private router: IRouter,
  ) {
    makeAutoObservable(this);
  }

  @computed public get userName(): string {
    const currentUser: IUser = this.userService.getUser();

    return currentUser.name;
  }

  @action public viewNotifications = (): void => {
    this.pushNotificationService.authorize();
    this.unreadNotifications = Math.max(this.unreadNotifications - 1, 0);
  };

  public logout = async (): Promise<void> => {
    try {
      await this.sessionService.logout();
      this.router.replace('/auth');
    } catch {
      // no-op
    }
  };
}
