import React from 'react';
import { interfaces } from 'inversify';

import { AppModule } from '@/di/model';
import { IRouter } from '@/router';

import { IModalService } from './modal';
import { IProcessInfoService } from './process-info';

interface Props {
  get<T>(id: interfaces.ServiceIdentifier<T>): T;
}

export const App: React.FC<Props> = ({ get }) => {

  const router = get<IRouter>(AppModule.ROUTER);
  const modalService = get<IModalService>(AppModule.MODAL);
  const processInfoService = get<IProcessInfoService>(AppModule.PROCESS_INFO);

  React.useEffect(() => {
    processInfoService.startListening();
  }, []);

  return (
    <>
      {router.getWindow()}
      {modalService.getWindow()}
    </>
  );
};
