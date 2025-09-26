import { Locale, Messages } from '@lingui/core';

import { ITranslationProvider } from './lingui-i18n.service';

export class LocalTranslationProvider implements ITranslationProvider {
  public getTranslations(locale: Locale): Promise<Messages> {
    switch (locale) {
      default:
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@formatjs/intl-pluralrules/locale-data/en');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./locales/en.po').messages;
    }
  }
}
