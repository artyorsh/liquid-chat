import React from 'react';
import '@/uilib';

import { AppModule } from '@/di/model';
import { IRouter } from '@/router';

import { container } from './di';
import { IModalService } from './modal';
import { IProcessInfoService } from './process-info';

export class App extends React.Component {

  private router: IRouter;
  private modalService: IModalService;
  private processInfoService: IProcessInfoService;

  constructor(props: {}) {
    super(props);
    this.router = container.get<IRouter>(AppModule.ROUTER);
    this.modalService = container.get<IModalService>(AppModule.MODAL);
    this.processInfoService = container.get<IProcessInfoService>(AppModule.PROCESS_INFO);

    this.processInfoService.startListening();
  }

  public render(): React.ReactElement {
    return (
      <>
        {this.router.getWindow()}
        {this.modalService.getWindow()}
      </>
    );
  }
}
