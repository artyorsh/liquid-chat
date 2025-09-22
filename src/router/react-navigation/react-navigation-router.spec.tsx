import { createElement } from 'react';
import { View } from 'react-native';
import { ReactNavigationRouter } from './react-navigation-router';
import { render, waitFor } from '@testing-library/react-native';

import { ILogger } from '@/log';

import { IRouter } from '..';
import { StackTreeFactory } from './stack-tree-factory';

jest.unmock('./react-navigation-router');

const NAVIGATION_EVENT_DEBOUNCE_MS = 10;

describe('ReactNavigationRouter', () => {

  let logger: ILogger;
  let router: IRouter;

  beforeEach(() => {
    logger = jest.requireMock('@/log/log.service').LogService()
      .createLogger(`[Test] ${ReactNavigationRouter.name}`);

    router = new ReactNavigationRouter(logger, StackTreeFactory(() => ({
      '/': () => createElement(View, { testID: 'screen-root' }),
      '/chats': () => createElement(View, { testID: 'screen-chats' }),
      '/chats/:id': () => createElement(View, { testID: 'screen-chat' }),
    })));
  });

  it('should mount only root screen', () => {
    const api = render(router.getWindow());

    expect(api.getByTestId('screen-root')).toBeTruthy();
    expect(api.queryByTestId('screen-chats')).toBeFalsy();
  });

  it('should mount target screen on navigate', async () => {
    const api = render(router.getWindow());

    router.navigate('/chats');

    await waitFor(() => {
      expect(api.getByTestId('screen-chats')).toBeTruthy();
    });
  });

  it('should unmount target screen, mount root screen on goBack', async () => {
    const api = render(router.getWindow());

    router.navigate('/chats');

    await new Promise((resolve) => setTimeout(resolve, NAVIGATION_EVENT_DEBOUNCE_MS));
    router.goBack();

    await waitFor(() => {
      expect(api.queryByTestId('screen-home')).toBeFalsy();
      expect(api.getByTestId('screen-chats')).toBeTruthy();
    });
  });

  it('should notify root screen on focus', async () => {
    const onFocusListener = jest.fn();
    router.subscribe('/', { onFocus: onFocusListener });

    render(router.getWindow());

    await waitFor(() => {
      expect(onFocusListener).toHaveBeenCalledTimes(1);
    });
  });

  it('should notify target screen on focus, parent screen on blur', async () => {
    const onFocusListener = jest.fn();
    router.subscribe('/chats', { onFocus: onFocusListener });

    const onBlurListener = jest.fn();
    router.subscribe('/', { onBlur: onBlurListener });

    render(router.getWindow());
    router.navigate('/chats');

    await waitFor(() => {
      expect(onFocusListener).toHaveBeenCalledTimes(1);
      expect(onBlurListener).toHaveBeenCalledTimes(1);
    });
  });

  it('should notify target screen on blur, parent screen on focus', async () => {
    const onBlurListener = jest.fn();
    router.subscribe('/chats', { onBlur: onBlurListener });

    const onFocusListener = jest.fn();
    router.subscribe('/', { onFocus: onFocusListener });

    render(router.getWindow());
    router.navigate('/chats');

    await new Promise((resolve) => setTimeout(resolve, NAVIGATION_EVENT_DEBOUNCE_MS));
    router.goBack();

    await waitFor(() => {
      expect(onBlurListener).toHaveBeenCalledTimes(1);
      expect(onFocusListener).toHaveBeenCalledTimes(2);
    });
  });

});
