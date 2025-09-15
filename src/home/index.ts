import React from 'react';
import { ContainerModule, interfaces } from 'inversify';

import { ISessionService, SESSION_SERVICE_ID } from '@/auth/session';
import { ILogService, LOG_SERVICE_ID } from '@/log';
import { IModalService, MODAL_SERVICE_ID } from '@/modal';
import { IPushNotificationService, PUSH_NOTIFICATION_SERVICE_ID } from '@/push-notification';
import { IRouter, ROUTER_SERVICE_ID } from '@/router';
import { IUserService, USER_SERVICE_ID } from '@/user';

import { HomeAPI } from './home.api';
import { Home, IHomeVM } from './home.component';
import { HomeVM } from './home.vm';
import { PostDetailsPresenter } from './post-details/post-details-presenter';
import { IPost } from './posts-list/model';
import { IPostsListVM } from './posts-list/posts-list.component';
import { IPostDetailsPresenter, PostsListVM } from './posts-list/posts-list.vm';

export type IHomeRoute = '/home';

export const HOME_SCREEN_SERVICE_ID: symbol = Symbol.for('HomeScreen');

export const HomeScreenModule = new ContainerModule(bind => {
  bind<interfaces.Factory<React.FC>>(HOME_SCREEN_SERVICE_ID)
    .toFactory(context => () => React.createElement(Home, { vm: createHomeVM(context) }));
});

const createHomeVM = (context: interfaces.Context): IHomeVM => {
  const router: IRouter = context.container.get(ROUTER_SERVICE_ID);
  const sessionService: ISessionService = context.container.get(SESSION_SERVICE_ID);
  const userService: IUserService = context.container.get(USER_SERVICE_ID);
  const pushNotificationService: IPushNotificationService = context.container.get(PUSH_NOTIFICATION_SERVICE_ID);

  const createPostsList = (posts: IPost[]): IPostsListVM => createPostsListVM(context, posts);

  return new HomeVM(
    sessionService,
    userService,
    pushNotificationService,
    router,
    new HomeAPI(),
    createPostsList,
  );
};

const createPostsListVM = (context: interfaces.Context, posts: IPost[]): IPostsListVM => {
  const modalService: IModalService = context.container.get(MODAL_SERVICE_ID);
  const logService: ILogService = context.container.get(LOG_SERVICE_ID);
  const presenter: IPostDetailsPresenter = new PostDetailsPresenter(modalService);

  return new PostsListVM(
    posts,
    presenter,
    logService,
  );
};

