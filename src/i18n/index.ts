import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';

import { LinguiI18nService } from './lingui-i18n.service';
import { LocalTranslationProvider } from './local-translation-provider';

export interface II18nService {
  configure(): Promise<void>;
}

export const I18nModule = new ContainerModule(({ bind }) => {
  bind(AppModule.I18N)
    .toDynamicValue(context => createI18nService(context))
    .inSingletonScope();
});

const createI18nService = (_context: ResolutionContext): II18nService => {
  return new LinguiI18nService({
    translationProvider: new LocalTranslationProvider(),
  });
};
