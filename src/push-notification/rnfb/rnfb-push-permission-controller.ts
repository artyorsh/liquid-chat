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

  public isGranted = (): Promise<boolean> => {
    return this.getStatus()
      .then(status => status === 'granted');
  };

  public request = (): Promise<void> => {
    return this.getStatus().then(status => {
      switch (status) {
        case 'granted':
          return this.requestSystem();

        case 'denied':
          return Linking.openSettings();

        case 'not_requested':
          return this.requestSystem();
      }
    });
  };

  private requestSystem = (): Promise<void> => {
    return requestPermission(this.rnfb, this.requestOptions).then(() => {
      return this.getStatus().then(result => {
        if (result !== 'granted') {
          throw new Error('User did not grant permission');
        }
      });
    });
  };

  private getStatus = (): Promise<IPermissionRequestStatus> => {
    return hasPermission(this.rnfb).then(result => {
      switch (result) {
        // case FirebaseMessagingTypes.AuthorizationStatus.NOT_DETERMINED:
        case -1:
          return 'not_requested';

        // case FirebaseMessagingTypes.AuthorizationStatus.DENIED:
        case 0:
          return 'denied';

        // case FirebaseMessagingTypes.AuthorizationStatus.AUTHORIZED:
        case 1:

        // case FirebaseMessagingTypes.AuthorizationStatus.PROVISIONAL:
        case 2:
          return 'granted';

        default:
          return 'denied';
      }
    });
  };
}
