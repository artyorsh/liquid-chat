import { Configuration, MMKV } from 'react-native-mmkv';

import { IUserConsentStorage } from './user-consent-provider';

export class UserConsentMMKVStorage implements IUserConsentStorage {

  private static KEY: string = 'AI_DOWNLOAD_CONSENT';

  private mmkv: MMKV;

  constructor(config?: Omit<Configuration, 'id'>) {
    this.mmkv = new MMKV({ ...config, id: '@ai/download-consent' });
  }

  public getAllowed(): Promise<boolean> {
    const result: boolean = this.mmkv.getBoolean(UserConsentMMKVStorage.KEY);

    return Promise.resolve(result);
  }

  public setAllowed(allowed: boolean): Promise<void> {
    this.mmkv.set(UserConsentMMKVStorage.KEY, allowed);

    return Promise.resolve();
  }
}
