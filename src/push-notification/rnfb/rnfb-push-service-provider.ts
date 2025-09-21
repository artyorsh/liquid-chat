import { getApp } from '@react-native-firebase/app';
import { FirebaseMessagingTypes, getAPNSToken, getInitialNotification, getToken, onMessage, onNotificationOpenedApp, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

import { IPushNotification, IPushNotificationHandler, IPushNotificationToken, IPushServiceProvider } from '../push-notification.service';

export class RNFBPushServiceProvider implements IPushServiceProvider {

  private handlers: IPushNotificationHandler[] = [];

  private get rnfb(): FirebaseMessagingTypes.Module {
    return getApp().messaging();
  }

  constructor() {
    onMessage(this.rnfb, m => {
      const notification: IPushNotification = this.createPushNotification(m);
      this.handlers.forEach(h => h.handleForeground(notification));
    });

    setBackgroundMessageHandler(this.rnfb, async m => {
      const notification: IPushNotification = this.createPushNotification(m);
      this.handlers.forEach(h => h.handleBackground(notification));
    });

    onNotificationOpenedApp(this.rnfb, m => {
      const notification: IPushNotification = this.createPushNotification(m);
      this.handlers.forEach(h => h.handleOpen(notification));
    });

    this.handleInitialNotification();
  }

  public subscribe(handler: IPushNotificationHandler): void {
    this.handlers.push(handler);
  }

  public getToken = async (): Promise<IPushNotificationToken> => {
    const apns: string = await getAPNSToken(this.rnfb);
    const fcm: string = await getToken(this.rnfb);

    return ({ fcm, apns });
  };

  private createPushNotification = (message: FirebaseMessagingTypes.RemoteMessage): IPushNotification => {
    return {
      id: message.messageId || '',
      title: message.notification?.title || '',
      body: message.notification?.body || '',
      data: message.data || {},
    };
  };

  private async handleInitialNotification(): Promise<void> {
    const message: FirebaseMessagingTypes.RemoteMessage | null = await getInitialNotification(this.rnfb);

    if (!message) {
      return;
    }

    const notification: IPushNotification = this.createPushNotification(message);
    this.handlers.forEach(h => h.handleOpen(notification));
  }

}
