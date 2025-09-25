import { IPushNotificationToken, IPushServiceProvider } from '../push-notification.service';

export class MockPushServiceProvider implements IPushServiceProvider {

  public subscribe(): Promise<void> {
    return Promise.resolve();
  }

  public getToken(): Promise<IPushNotificationToken> {
    const message: string = 'Can\'t get FCM or APNs token in Expo Go environment';

    return Promise.resolve({ fcm: message, apns: message });
  }
}
