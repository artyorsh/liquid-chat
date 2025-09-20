import { action, computed, makeObservable, observable } from 'mobx';

import { ILogger, ILogService } from '@/log';
import { IModalService } from '@/modal';

import { IPost } from '..';
import { IPostVM } from './post-item.component';
import { IPostListVM } from './post-list.component';

export interface IPostsListOptions {
  modalService: IModalService;
  logger: ILogService;
}

export interface IPostDetailsPresenter {
  viewDetails(post: IPost, callbacks: IPostDetailsPresenterCallbacks): void;
}

export interface IPostDetailsPresenterCallbacks {
  markHidden(post: IPost): void;
}

export class PostListVM implements IPostListVM {

  private detailsPresenter: IPostDetailsPresenter;
  private logger: ILogger;

  @observable private data: IPost[];

  constructor(
    data: IPost[],
    detailsPresenter: IPostDetailsPresenter,
    logger: ILogger,
  ) {
    makeObservable(this);

    this.data = data;
    this.detailsPresenter = detailsPresenter;
    this.logger = logger;
  }

  @computed public get posts(): IPostVM[] {
    return this.data
      .map((post) => this.createPostVM(post));
  }

  private createPostVM = (post: IPost): IPostVM => {
    return {
      post,
      viewDetails: () => this.viewPostDetails(post),
    };
  };

  private viewPostDetails = (post: IPost): void => {
    this.logger.info(`viewPostDetails: ${post.id}`);

    this.detailsPresenter.viewDetails(post, {
      markHidden: (_post: IPost) => this.removePost(post),
    });
  };

  @action private removePost = (post: IPost): void => {
    this.logger.info(`removePost: ${post.id}`);

    this.data = this.data.filter(p => p.id !== post.id);
  };
}
