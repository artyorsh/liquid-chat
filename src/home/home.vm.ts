import { observable } from 'mobx';

import { IPostsDatasource, IPostsListFactory } from '@/posts';
import { IPostsListVM } from '@/posts/posts-list/posts-list.component';
import { INavigationLifecycleListener, IRouter } from '@/router';

import { IHomeVM } from './home.component';
import { IWelcomeHeaderVM } from './welcome-header/welcome-header.component';

export class HomeVM implements IHomeVM, INavigationLifecycleListener {

  @observable public posts!: IPostsListVM;
  @observable public loading: boolean = true;

  public welcomeHeader: IWelcomeHeaderVM;

  constructor(
    router: IRouter,
    welcomeHeaderVM: IWelcomeHeaderVM,
    private postsDatasource: IPostsDatasource,
    private createPostsList: IPostsListFactory,
  ) {

    router.subscribe('/home', this);
    this.welcomeHeader = welcomeHeaderVM;
  }

  public onFocus = async (): Promise<void> => {
    const posts = await this.postsDatasource.getPosts();
    this.posts = this.createPostsList(posts);
    this.loading = false;
  };

  public onBlur = (): void => {
    /* no-op */
  };
}
