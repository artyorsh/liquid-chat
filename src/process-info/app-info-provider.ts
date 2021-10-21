import { Platform } from 'react-native';
import * as Application from 'expo-application';

import { IProcessInfoData, IProcessInfoProvider } from './process-info.service';

export type AppInfoProviderId = 'AppInfo';

export interface IAppInfoData extends IProcessInfoData {
  applicationId: string;
  applicationName: string;
  nativeApplicationVersion: string;
  nativeBuildVersion: string;
  installationTime: string;
  [key: string]: any; // platform-specific data
}

export class AppInfoProvider implements IProcessInfoProvider<IAppInfoData> {

  public getId(): string {
    return 'AppInfo';
  }

  public getCurrentData = async (): Promise<IAppInfoData> => {
    const platformData: IProcessInfoData = await this.getPlatformData();
    const installationTime = await Application.getInstallationTimeAsync();

    const data: IAppInfoData = {
      applicationId: Application.applicationId,
      applicationName: Application.applicationName,
      nativeApplicationVersion: Application.nativeApplicationVersion,
      nativeBuildVersion: Application.nativeBuildVersion,
      installationTime: installationTime.toISOString(),
      [Platform.OS]: platformData,
    };

    return {
      ...data,
      toString: () => JSON.stringify(data, null, 2),
    };
  };

  public subscribe(_callback: (data: IAppInfoData) => void): Function {
    return () => {
      /** no-op */
    };
  }

  private getPlatformData = async (): Promise<IProcessInfoData> => {
    switch (Platform.OS) {
      case 'android':
        return await this.getAndroidData();

      case 'ios':
        return await this.getIosData();

      default:
        return {};
    }
  };

  private getAndroidData = async (): Promise<IProcessInfoData> => {
    const installReferrer = await Application.getInstallReferrerAsync();
    const lastUpdateTime = await Application.getLastUpdateTimeAsync();

    const data: Record<string, any> = {
      installReferrer,
      lastUpdateTime: lastUpdateTime.toISOString(),
    };

    return {
      ...data,
      toString: () => JSON.stringify(data, null, 2),
    };
  };

  private getIosData = async (): Promise<IProcessInfoData> => {
    const releaseType = await Application.getIosApplicationReleaseTypeAsync();
    const pushNotificationServiceEnvironment = await Application.getIosPushNotificationServiceEnvironmentAsync();

    const data: Record<string, any> = {
      releaseType: releaseType,
      pushNotificationServiceEnvironment: pushNotificationServiceEnvironment,
    };

    return {
      ...data,
      toString: () => JSON.stringify({
        ...data,
        releaseType: this.getReleaseTypeDescription(releaseType),
      }, null, 2),
    };
  };

  private getReleaseTypeDescription(releaseType: Application.ApplicationReleaseType): string {
    switch (releaseType) {
      case Application.ApplicationReleaseType.SIMULATOR:
        return 'Simulator';

      case Application.ApplicationReleaseType.ENTERPRISE:
        return 'Enterprise';

      case Application.ApplicationReleaseType.DEVELOPMENT:
        return 'Development';

      case Application.ApplicationReleaseType.AD_HOC:
        return 'Ad Hoc';

      case Application.ApplicationReleaseType.APP_STORE:
        return 'App Store';

      default:
        return 'Unknown';
    }
  }
}
