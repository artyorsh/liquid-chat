import { useEffect } from 'react';
import { registerDevMenuItems } from 'expo-dev-menu';
import { ServiceIdentifier } from 'inversify';

import { AppModule } from '@/di';
import { IRouter } from '@/router';

import { II18nService } from './i18n';
import { IModalService } from './modal';
import { IProcessInfoService } from './process-info';

interface Props {
  get<T>(id: ServiceIdentifier<T>): T;
}

export const App: React.FC<Props> = ({ get }) => {

  const router: IRouter = get(AppModule.ROUTER);
  const modalService: IModalService = get(AppModule.MODAL);
  const processInfoService: IProcessInfoService = get(AppModule.PROCESS_INFO);
  const i18nService: II18nService = get(AppModule.I18N);

  useEffect(() => {
    processInfoService.startListening();
    const i18nDevMenuItems = i18nService.getDevMenuItems();

    registerDevMenuItems(i18nDevMenuItems);
  }, [processInfoService, i18nService]);

  const I18nProvider = i18nService.getProviderComponent();

  return (
    <I18nProvider>
      {router.getWindow()}
      {modalService.getWindow()}
    </I18nProvider>
  );
};
