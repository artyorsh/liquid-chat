import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { ISessionService } from '@/auth/session';
import { IPushNotificationService } from '@/push-notification';
import { IRouter } from '@/router';
import { IUserService } from '@/user';

import { WelcomeHeader } from './welcome-header.component';
import { WelcomeHeaderVM } from './welcome-header.vm';

describe('Home/WelcomeHeader', () => {

  let vm: WelcomeHeaderVM;
  let router: IRouter;
  let sessionService: ISessionService;
  let userService: IUserService;
  let pushNotificationService: IPushNotificationService;

  beforeEach(() => {
    router = jest.requireMock('@/router/react-navigation/react-navigation-router').RouterService();
    sessionService = jest.requireMock('@/auth/session/session.service').SessionService();
    userService = jest.requireMock('@/user/user.service').UserService();
    pushNotificationService = jest.requireMock('@/push-notification/push-notification.service').PushNotificationService();

    vm = new WelcomeHeaderVM(
      userService,
      pushNotificationService,
      sessionService,
      router,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with user name in title', () => {
    const api = render(<WelcomeHeader vm={vm} />);
    expect(api.findByText(/Test User/)).toBeTruthy();
  });

  it('should replace with welcome screen when logged out', async () => {
    const api = render(<WelcomeHeader vm={vm} />);
    fireEvent.press(api.getByTestId('logout-button'));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/auth');
    });
  });

  it('should authorize push notifications', () => {
    const api = render(<WelcomeHeader vm={vm} />);
    fireEvent.press(api.getByTestId('notifications-button'));

    expect(pushNotificationService.authorize).toHaveBeenCalled();
  });

  it('should not navigate if logout is unsuccessful', async () => {
    sessionService.logout = jest.fn(() => Promise.reject());

    vm = new WelcomeHeaderVM(
      userService,
      pushNotificationService,
      sessionService,
      router,
    );

    const api = render(<WelcomeHeader vm={vm} />);
    fireEvent.press(api.getByTestId('logout-button'));

    await waitFor(() => {
      expect(router.replace).not.toHaveBeenCalled();
    });
  });
});
