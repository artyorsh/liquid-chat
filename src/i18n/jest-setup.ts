import { i18n } from '@lingui/core';

i18n.loadAndActivate({
  locale: 'en',
  messages: {},
});

jest.mock('@lingui/react', () => {
  const actual = jest.requireActual('@lingui/react');

  return {
    ...actual,
    useLingui: jest.fn(() => ({
      t: (message: string) => message,
    })),
  };
});

jest.mock('@lingui/react/macro', () => {
  return jest.requireMock('@lingui/react');
});
