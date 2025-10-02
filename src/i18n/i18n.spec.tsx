import { render } from '@testing-library/react-native';
import { i18n } from '@lingui/core';

import { Text } from '@/uilib/text.component';

import { II18nService } from '.';
import { LinguiI18nService } from './lingui-i18n.service';

describe('i18n/LinguiI18nService', () => {
  let i18nService: II18nService;

  beforeEach(() => {
    i18nService = new LinguiI18nService({
      locale: 'en',
      translationProvider: {
        getSupportedLocales: () => ['en', 'de'],
        getTranslations: (locale) => {
          switch (locale) {
            case 'en': return ['en', { 'hello': 'hello_en' }];

            case 'de': return ['de', { 'hello': 'hello_de' }];
          }
        },
      },
    });
  });

  it('should configure lingui', () => {
    expect(i18n.t('hello')).toBe('hello_en');
  });

  it('should switch locale', () => {
    i18nService.setLocale('de');
    expect(i18n.t('hello')).toBe('hello_de');
  });

  it('should render translation', () => {
    const ProviderComponent = i18nService.getProviderComponent();

    const api = render(
      <ProviderComponent>
        <Text>
          {i18n.t('hello')}
        </Text>
      </ProviderComponent>,
      {},
    );

    expect(api.getByText('hello_en')).toBeTruthy();
  });
});
