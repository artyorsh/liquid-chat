import React from 'react';
import '@/uilib';

import { IRouter, ROUTER_SERVICE_ID } from '@/router';

import { container } from './di';
import { IModalService, MODAL_SERVICE_ID } from './modal';
import { IProcessInfoService, PROCESS_INFO_SERVICE_ID } from './process-info';

export class App extends React.Component {

  private router: IRouter;
  private modalService: IModalService;
  private processInfoService: IProcessInfoService;

  constructor(props: {}) {
    super(props);
    this.router = container.get<IRouter>(ROUTER_SERVICE_ID);
    this.modalService = container.get<IModalService>(MODAL_SERVICE_ID);
    this.processInfoService = container.get<IProcessInfoService>(PROCESS_INFO_SERVICE_ID);

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
