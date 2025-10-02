import { createElement, FC } from 'react';
import { i18n, Messages } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import '@formatjs/intl-locale/polyfill-force';
import '@formatjs/intl-pluralrules/polyfill-force';
import { ExpoDevMenuItem } from 'expo-dev-menu';

import { II18nService, ISupportedLocale } from '.';

export interface II18nManagerConfig {
  locale: string;
  translationProvider: ITranslationProvider;
}

export interface ITranslationProvider {
  getSupportedLocales(): string[];
  getTranslations(locale: string): [string, Messages];
}

export class LinguiI18nService implements II18nService {

  constructor(private config: II18nManagerConfig) {
    this.setLocale(config.locale);
  }

  public getCurrentLocale(): ISupportedLocale {
    return i18n.locale as ISupportedLocale;
  }

  public setLocale(locale: string): void {
    const [languageCode, messages] = this.config.translationProvider.getTranslations(locale);
    i18n.loadAndActivate({ locale: languageCode, messages });
  }

  public getProviderComponent(): FC {
    return (props) => createElement(I18nProvider, { ...props, i18n });
  }

  public getDevMenuItems(): ExpoDevMenuItem[] {
    const supportedLocales: string[] = this.config.translationProvider.getSupportedLocales();

    return supportedLocales.map(locale => ({
      name: `Locale: ${locale}`,
      callback: () => this.setLocale(locale),
    }));
  }
}
