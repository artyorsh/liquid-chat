import React from 'react';
import { ContainerModule } from 'inversify';

import { AppModule } from '@/di/model';

import { AnimatedAlertLayoutProvider } from './layout-provider/animated-alert-layout-provider';
import { AnimatedBottomSheetLayoutProvider } from './layout-provider/animated-bottom-sheet-layout-provider';
import { ILayoutProvider } from './modal.component';
import { IModalPresentationPolicy, ModalService } from './modal.service';
import { OneAtTimePresentationPolicy } from './presentation-policy/one-at-time-presentation-policy';

export interface IModalController<Result = any> {
  resolve(result?: Result): void;
  reject(error: Error): void;
}

export enum PresentationType {
  ALERT = 'alert',
  BOTTOM_SHEET = 'bottom_sheet'
}

export type IModalFactory<Result = any> = (controller: IModalController<Result>) => React.ReactElement;

export interface IWindowSizeListener {
  onWindowSizeChange(numberOfActiveModals: number): void;
}

export interface IModalService {
  getWindow(): React.ReactElement;
  /**
   * @returns a promise that is resolved when the modal is hidden via {IModalController.hide}
   */
  show<Result = any>(factory: IModalFactory<Result>, presentationType?: PresentationType): Promise<Result>;

  /**
   * @returns a function that can be used to unsubscribe from the modal service
   */
  subscribe(listener: IWindowSizeListener): Function;
}

export const ModalModule = new ContainerModule(bind => {
  const useNativeDriver: boolean = true;
  const animationDuration: number = 200;

  const alertLayoutProvider: ILayoutProvider = new AnimatedAlertLayoutProvider({
    useNativeDriver,
    duration: animationDuration,
  });

  const bottomSheetLayoutProvider: ILayoutProvider = new AnimatedBottomSheetLayoutProvider({
    useNativeDriver,
    duration: animationDuration,
  });

  const presentationPolicy: IModalPresentationPolicy = new OneAtTimePresentationPolicy();

  const modalService: IModalService = new ModalService({
    presentationPolicy,
    alert: alertLayoutProvider,
    bottom_sheet: bottomSheetLayoutProvider,
  });

  bind<IModalService>(AppModule.MODAL)
    .toConstantValue(modalService);
});
