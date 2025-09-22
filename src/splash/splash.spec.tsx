import { render, waitFor } from '@testing-library/react-native';

import { IRouter } from '@/router';

import { ISplashVM, Splash } from './splash.component';
import { ISplashScreenConfig, SplashVM } from './splash.vm';

describe('Splash', () => {

  let router: IRouter;
  let config: ISplashScreenConfig;

  beforeEach(() => {
    router = jest.requireMock('@/router/react-navigation/react-navigation-router').RouterService();
    config = {
      image: () => ({ uri: 'http://' }),
      backgroundColor: () => '#000000',
      imageWidth: 100,
      task: {
        run: jest.fn(() => Promise.resolve(['/chats', {}])),
      },
      animation: {
        playTillIntermediate: jest.fn(() => Promise.resolve()),
        finish: jest.fn(() => Promise.resolve()),
        getImageStyle: jest.fn(() => ({})),
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to resolved route', async () => {
    const vm: ISplashVM = new SplashVM(router, config);

    render(<Splash vm={vm} />);

    await waitFor(() => {
      return expect(router.replace).toHaveBeenCalledWith('/chats', {});
    });
  });
});
