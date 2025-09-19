import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { ILogService } from '@/log';
import { IModalService } from '@/modal';

import { PostDetailsPresenter } from './post-details/post-details-presenter';
import { PostsAPI } from './posts-list/posts.api';
import { IPostsListVM } from './posts-list/posts-list.component';
import { IPostDetailsPresenter, PostsListVM } from './posts-list/posts-list.vm';

export interface IPost {
  id: string;
  title: string;
  body: string;
  image_url: string;
}

export interface IPostsDatasource {
  getPosts(): Promise<IPost[]>;
}

export type IPostsListFactory = (posts: IPost[]) => IPostsListVM;

export const PostsModule = new ContainerModule(({ bind }) => {
  bind(AppModule.POSTS_DATASOURCE).toConstantValue(new PostsAPI());

  bind<IPostsListFactory>(AppModule.POSTS_VM).toFactory(context => {
    return (posts: IPost[]) => createPostsListVM(posts, context);
  });
});

const createPostsListVM = (posts: IPost[], context: ResolutionContext): IPostsListVM => {
  const modalService = context.get<IModalService>(AppModule.MODAL);
  const logService = context.get<ILogService>(AppModule.LOG);
  const detailsPresenter: IPostDetailsPresenter = new PostDetailsPresenter(modalService);

  return new PostsListVM(
    posts,
    detailsPresenter,
    logService.createLogger(PostsListVM.name),
  );
};
