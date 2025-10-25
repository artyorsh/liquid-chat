import { makeObservable, observable, runInAction } from 'mobx';

import { IPostsDatasource, IPostsListFactory } from '@/posts';
import { IPostListVM } from '@/posts/post-list/post-list.component';

import { IHomeVM } from './home.component';
import { IWelcomeHeaderVM } from './welcome-header/welcome-header.component';

export class HomeVM implements IHomeVM {
  @observable public posts!: IPostListVM;
  @observable public loading: boolean = true;

  public welcomeHeader: IWelcomeHeaderVM;

  constructor(
    welcomeHeaderVM: IWelcomeHeaderVM,
    private postsDatasource: IPostsDatasource,
    private createPostsList: IPostsListFactory,
  ) {
    this.welcomeHeader = welcomeHeaderVM;

    makeObservable(this);
  }

  public onMount = async (): Promise<void> => {
    const posts = await this.postsDatasource.getPosts();

    runInAction(() => {
      this.posts = this.createPostsList(posts);
      this.loading = false;
    });
  };

  public onUnmount = (): void => {
    /* no-op */
  };
}
