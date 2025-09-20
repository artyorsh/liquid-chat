import React from 'react';
import { ServiceIdentifier } from 'inversify';

import { AppModule } from '@/di';
import { IRouter } from '@/router';

import { IModalService } from './modal';
import { IProcessInfoService } from './process-info';

interface Props {
  get<T>(id: ServiceIdentifier<T>): T;
}

export const App: React.FC<Props> = ({ get }) => {

  const router: IRouter = get(AppModule.ROUTER);
  const modalService: IModalService = get(AppModule.MODAL);
  const processInfoService: IProcessInfoService = get(AppModule.PROCESS_INFO);

  React.useEffect(() => {
    processInfoService.startListening();
  }, [processInfoService]);

  return (
    <>
      {router.getWindow()}
      {modalService.getWindow()}
    </>
  );
};
