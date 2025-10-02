import { Messages } from '@lingui/core';

import { ILogger } from '@/log';

import { ISupportedLocale } from '.';
import { ITranslationProvider } from './lingui-i18n.service';

export interface ILocalTranslationProviderConfig {
  locales: Record<ISupportedLocale, () => Messages>;
  logger?: ILogger;
}

export class LocalTranslationProvider implements ITranslationProvider {

  constructor(private config: ILocalTranslationProviderConfig) {
  }

  public getSupportedLocales(): string[] {
    return Object.keys(this.config.locales);
  }

  public getTranslations(locale: string): [string, Messages] {
    const messages: Messages = this.config.locales[locale]?.();

    if (!messages) {
      const firstSupported = this.getSupportedLocales()[0];
      this.config.logger?.warn(`Unsupported locale: ${locale}, falling back to ${firstSupported}.`);

      return this.getTranslations(firstSupported);
    }

    return [locale, messages];
  }
}
