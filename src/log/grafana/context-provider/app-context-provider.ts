import { Platform } from 'react-native';
import { applicationId, nativeApplicationVersion, nativeBuildVersion } from 'expo-application';
import { brand, deviceName, modelName, osVersion } from 'expo-device';

import { IGrafanaLogContext, IGrafanaLogContextProvider } from '../grafana-log-transporter';

export class AppContextProvider implements IGrafanaLogContextProvider {
  public getContext(): IGrafanaLogContext {
    return {
      app: applicationId,
      os: Platform.OS,
      version: `${nativeApplicationVersion} (${nativeBuildVersion})`,
      runtime: `${deviceName}/${Platform.OS}/${osVersion}/${brand}/${modelName}`,
    };
  }
}
