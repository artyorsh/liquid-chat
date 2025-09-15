import { computed, makeObservable, observable } from 'mobx';

import { ILogger, ILogService } from '@/log';
import { IModalService } from '@/modal';

import { IPost } from './model';
import { IPostVM } from './post-item.component';
import { IPostsListVM } from './posts-list.component';

export interface IPostsListOptions {
  modalService: IModalService;
  logger: ILogService;
}

export interface IPostDetailsPresenter {
  viewDetails(post: IPost, callbacks: IPostDetailsCallbacks): void;
}

export interface IPostDetailsCallbacks {
  markHidden(post: IPost): void;
}

export class PostsListVM implements IPostsListVM {

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
      title: post.title,
      body: post.body,
      image: { uri: post.image_url },
      viewDetails: () => this.viewPostDetails(post),
    };
  };

  private viewPostDetails = (post: IPost): void => {
    this.logger.info(`viewPostDetails: ${post.id}`);

    this.detailsPresenter.viewDetails(post, {
      markHidden: (_post: IPost) => this.removePost(post),
    });
  };

  private removePost = (post: IPost): void => {
    this.logger.info(`removePost: ${post.id}`);

    this.data = this.data.filter(p => p.id !== post.id);
  };
}
