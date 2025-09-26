import { i18n, Locale, Messages } from '@lingui/core';
import '@formatjs/intl-locale/polyfill-force';
import '@formatjs/intl-pluralrules/polyfill-force';
import { getLocales, Locale as ExpoLocale } from 'expo-localization';

import { II18nService } from '.';

export interface II18nManagerConfig {
  translationProvider: ITranslationProvider;
}

export interface ITranslationProvider {
  getTranslations(locale: Locale): Promise<Messages>;
}

export class LinguiI18nService implements II18nService {

  private currentLocale: ExpoLocale;

  constructor(private config: II18nManagerConfig) {
    this.currentLocale = getLocales()[0];
  }

  public async configure(): Promise<void> {
    const languageCode: Locale = this.currentLocale.languageCode;
    const translations: Messages = await this.config.translationProvider.getTranslations(languageCode);

    i18n.loadAndActivate({
      locale: languageCode,
      messages: translations,
    });
  }
}
