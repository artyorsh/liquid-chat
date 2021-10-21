import { IModalService, PresentationType } from '@/modal';

import { IDownloadConsentProvider, IModelId } from '../mlc-provider';
import { UserConsent } from './user-consent.component';

export interface IUserConsentStorage {
  getAllowed(): Promise<boolean>;
  setAllowed(allowed: boolean): Promise<void>;
}

export class UserConsentProvider implements IDownloadConsentProvider {

  constructor(
    private modalService: IModalService,
    private consentStorage: IUserConsentStorage,
    private modelSize: number,
  ) {}

  public isAllowed(): Promise<boolean> {
    return this.consentStorage.getAllowed();
  }

  public requestDownload(_modelId: IModelId): Promise<void> {
    const modelSize: string = `${this.getModelSizeGBDescription(this.modelSize)} GB`;

    return this.modalService.show(controller => (
      <UserConsent
        modelSizeGB={modelSize}
        onAllow={() => controller.resolve()}
        onDeny={() => controller.reject(new Error('User denied.'))}
      />
    ), PresentationType.BOTTOM_SHEET);
    // return Promise.resolve();
  }

  private getModelSizeGBDescription(bytes: number): string {
    const gigabytes: number = bytes / (1024 * 1024 * 1024);

    return gigabytes.toFixed(2);
  }
}
