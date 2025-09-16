import { computed, makeAutoObservable, observable } from 'mobx';

import { ISessionService } from '@/auth/session';
import { IPostsApi, IPostsListFactory } from '@/posts';
import { IPostsListVM } from '@/posts/posts-list/posts-list.component';
import { IPushNotificationService } from '@/push-notification';
import { INavigationLifecycleListener, IRouter } from '@/router';
import { IUserService } from '@/user';

import { IHomeVM } from './home.component';
import { IWelcomeHeaderVM } from './welcome-header/welcome-header.component';

export class HomeVM implements IHomeVM, INavigationLifecycleListener {

  @observable public posts!: IPostsListVM;

  @computed public get loading(): boolean {
    return !this.posts;
  }

  @computed public get welcomeHeader(): IWelcomeHeaderVM {
    return {
      title: `Hello, ${this.userService.getUser().name}`,
      viewNotifications: this.viewNotifications,
      logout: this.logout,
    };
  }

  constructor(
    private sessionService: ISessionService,
    private userService: IUserService,
    private pushNotificationService: IPushNotificationService,
    private router: IRouter,
    private postsApi: IPostsApi,
    private createPostsList: IPostsListFactory,
  ) {

    router.subscribe('/home', this);
    makeAutoObservable(this);
  }

  public onFocus = async (): Promise<void> => {
    const posts = await this.postsApi.getPosts();
    this.posts = this.createPostsList(posts);
  };

  public onBlur = (): void => {
    /* no-op */
  };

  public logout = (): void => {
    this.sessionService.logout().then(() => {
      this.router.replace('/welcome');
    }).catch(() => {
      /* no-op */
    });
  };

  private viewNotifications = (): void => {
    this.pushNotificationService.authorize();
  };
}
