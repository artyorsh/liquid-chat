import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { ISessionService } from '@/auth/session';
import { ILogger } from '@/log';
import { IModalService } from '@/modal';
import { IPost, IPostsDatasource } from '@/posts';
import { PostDetailsPresenter } from '@/posts/post-details/post-details-presenter';
import { IPostsListVM } from '@/posts/posts-list/posts-list.component';
import { PostsListVM } from '@/posts/posts-list/posts-list.vm';
import { IPushNotificationService } from '@/push-notification';
import { IRouter } from '@/router';
import { IUserService } from '@/user';

import { Home, IHomeVM } from './home.component';
import { HomeVM } from './home.vm';

describe('Home', () => {

  let vm: IHomeVM;
  let router: IRouter;
  let sessionService: ISessionService;
  let userService: IUserService;
  let pushNotificationService: IPushNotificationService;
  let modalService: IModalService;
  let logger: ILogger;

  const postsApi: IPostsDatasource = {
    getPosts: jest.fn(() => Promise.resolve([])),
  };

  const createPostsListVM = (posts: IPost[]): IPostsListVM => new PostsListVM(
    posts,
    new PostDetailsPresenter(modalService),
    logger,
  );

  beforeEach(() => {
    router = jest.requireMock('@/router/react-navigation/react-navigation-router').RouterService();
    sessionService = jest.requireMock('@/auth/session/session.service').SessionService();
    userService = jest.requireMock('@/user/user.service').UserService();
    pushNotificationService = jest.requireMock('@/push-notification/push-notification.service').PushNotificationService();
    modalService = jest.requireMock('@/modal/modal.service').ModalService();
    logger = jest.requireMock('@/log/log.service').LogService()
      .createLogger(`[Test] ${HomeVM.name}`);

    vm = new HomeVM(
      sessionService,
      userService,
      pushNotificationService,
      router,
      postsApi,
      posts => createPostsListVM(posts),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with user name in title', () => {
    const api = render(<Home vm={vm} />);
    expect(api.findByText(/Test User/)).toBeTruthy();
  });

  it('should replace with welcome screen when logged out', async () => {
    const api = render(<Home vm={vm} />);
    fireEvent.press(api.getByTestId('logout-button'));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/welcome');
    });
  });

  it('should authorize push notifications', () => {
    const api = render(<Home vm={vm} />);
    fireEvent.press(api.getByTestId('notifications-button'));

    expect(pushNotificationService.authorize).toHaveBeenCalled();
  });

  it('should not navigate if logout is unsuccessful', async () => {
    sessionService.logout = jest.fn(() => Promise.reject());

    vm = new HomeVM(
      sessionService,
      userService,
      pushNotificationService,
      router,
      postsApi,
      posts => createPostsListVM(posts),
    );

    const api = render(<Home vm={vm} />);
    fireEvent.press(api.getByTestId('logout-button'));

    await waitFor(() => {
      expect(router.replace).not.toHaveBeenCalled();
    });
  });
});
