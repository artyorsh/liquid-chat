import * as SecureStore from 'expo-secure-store';

import { AnyAuthenticationToken, IAuthenticationStorage } from './session.service';

export class SecureAuthStorage implements IAuthenticationStorage<AnyAuthenticationToken> {

  private static KEY_TOKEN: string = 'token';

  public async getToken(): Promise<AnyAuthenticationToken | null> {
    const token = await SecureStore.getItemAsync(SecureAuthStorage.KEY_TOKEN);

    if (!token) {
      return null;
    }

    return JSON.parse(token);
  }

  public setToken(token: AnyAuthenticationToken): Promise<void> {
    return SecureStore.setItemAsync(SecureAuthStorage.KEY_TOKEN, JSON.stringify(token));
  }

  public clear(): Promise<void> {
    return SecureStore.deleteItemAsync(SecureAuthStorage.KEY_TOKEN);
  }
}
