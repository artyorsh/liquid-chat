import { Platform } from 'react-native';
import { applicationId, applicationName, ApplicationReleaseType, getInstallationTimeAsync, getInstallReferrerAsync, getIosApplicationReleaseTypeAsync, getIosPushNotificationServiceEnvironmentAsync, getLastUpdateTimeAsync, nativeApplicationVersion, nativeBuildVersion } from 'expo-application';

import { IProcessInfoData, IProcessInfoProvider } from '../process-info.service';

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
    const installationTime = await getInstallationTimeAsync();

    const data: IAppInfoData = {
      applicationId: applicationId,
      applicationName: applicationName,
      nativeApplicationVersion: nativeApplicationVersion,
      nativeBuildVersion: nativeBuildVersion,
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
    const installReferrer = await getInstallReferrerAsync();
    const lastUpdateTime = await getLastUpdateTimeAsync();

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
    const releaseType = await getIosApplicationReleaseTypeAsync();
    const pushNotificationServiceEnvironment = await getIosPushNotificationServiceEnvironmentAsync();

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

  private getReleaseTypeDescription(releaseType: ApplicationReleaseType): string {
    switch (releaseType) {
      case ApplicationReleaseType.SIMULATOR:
        return 'Simulator';

      case ApplicationReleaseType.ENTERPRISE:
        return 'Enterprise';

      case ApplicationReleaseType.DEVELOPMENT:
        return 'Development';

      case ApplicationReleaseType.AD_HOC:
        return 'Ad Hoc';

      case ApplicationReleaseType.APP_STORE:
        return 'App Store';

      default:
        return 'Unknown';
    }
  }
}
