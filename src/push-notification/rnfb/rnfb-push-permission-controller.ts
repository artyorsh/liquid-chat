import { Linking } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { FirebaseMessagingTypes, hasPermission, requestPermission } from '@react-native-firebase/messaging';

import { IPushPermissionController } from '../push-notification.service';

export type IPermissionRequestStatus =
  | 'not_requested'
  | 'denied'
  | 'granted';

export class RNFBPushPermissionController implements IPushPermissionController {

  private get rnfb(): FirebaseMessagingTypes.Module {
    return getApp().messaging();
  }

  constructor(private requestOptions: FirebaseMessagingTypes.IOSPermissions) {
  }

  public isGranted = async (): Promise<boolean> => {
    const status = await this.getStatus();

    return status === 'granted';
  };

  public request = async (): Promise<void> => {
    const status = await this.getStatus();

    switch (status) {
      case 'granted':
        return this.requestSystem();

      case 'denied':
        return Linking.openSettings();

      case 'not_requested':
        return this.requestSystem();
    }
  };

  private requestSystem = async (): Promise<void> => {
    await requestPermission(this.rnfb, this.requestOptions);
    const permissionStatus = await this.getStatus();

    if (permissionStatus !== 'granted') {
      throw new Error('User did not grant permission');
    }
  };

  private getStatus = async (): Promise<IPermissionRequestStatus> => {
    const permissionStatus = await hasPermission(this.rnfb);

    // The values are FirebaseMessagingTypes.AuthorizationStatus, which is not resolved at runtime.
    switch (permissionStatus) {
      case -1:
        return 'not_requested';

      case 0:
        return 'denied';

      case 1:

      case 2:
        return 'granted';

      default:
        return 'denied';
    }
  };
}
