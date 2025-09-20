import { ContainerModule } from 'inversify';

import { AppModule } from '@/di';

import { PostMockDatasource } from './datasource/post-mock-datasource';
import { createPostListViewModel } from './post-list';
import { IPostListVM } from './post-list/post-list.component';

export interface IPost {
  id: string;
  title: string;
  body: string;
  image_url: string;
}

export interface IPostsDatasource {
  getPosts(): Promise<IPost[]>;
}

export type IPostsListFactory = (posts: IPost[]) => IPostListVM;

export const PostsModule = new ContainerModule(({ bind }) => {
  const datasource: IPostsDatasource = new PostMockDatasource();

  bind(AppModule.POSTS_DATASOURCE)
    .toConstantValue(datasource);

  bind<IPostsListFactory>(AppModule.POSTS_VM)
    .toFactory(context => (posts: IPost[]) => createPostListViewModel(posts, context));
});
