import * as Device from 'expo-device';

import { IProcessInfoData, IProcessInfoProvider } from './process-info.service';

export type DeviceInfoProviderId = 'DeviceInfo';

export interface IDeviceInfoData extends IProcessInfoData {
  brand: string;
  deviceType: Device.DeviceType;
  deviceYearClass: number;
  isDevice: boolean;
  modelName: string;
  osName: string;
  osVersion: string;
  supportedCpuArchitectures: string[];
  totalMemory: string;
}

export class DeviceInfoProvider implements IProcessInfoProvider {

  public getId(): string {
    return 'DeviceInfo';
  }

  public getCurrentData(): Promise<IDeviceInfoData> {
    const data: IDeviceInfoData = {
      brand: Device.brand,
      deviceType: Device.deviceType,
      deviceYearClass: Device.deviceYearClass,
      isDevice: Device.isDevice,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      supportedCpuArchitectures: Device.supportedCpuArchitectures,
      totalMemory: this.getBytesDescription(Device.totalMemory),
    };

    return Promise.resolve({
      ...data,
      toString: () => JSON.stringify({
        ...data,
        deviceType: this.getDeviceTypeDescription(Device.deviceType),
        supportedCpuArchitectures: Device.supportedCpuArchitectures.join(', '),
        totalMemory: this.getBytesDescription(Device.totalMemory),
      }, null, 2),
    });
  }

  public subscribe(_callback: (data: IDeviceInfoData) => void): Function {
    return () => {
      /** no-op */
    };
  }

  private getDeviceTypeDescription(deviceType: Device.DeviceType): string {
    switch (deviceType) {
      case Device.DeviceType.PHONE:
        return 'Phone';

      case Device.DeviceType.TABLET:
        return 'Tablet';

      case Device.DeviceType.TV:
        return 'TV';

      case Device.DeviceType.DESKTOP:
        return 'Desktop';

      default:
        return 'Unknown';
    }
  }

  private getBytesDescription(bytes: number): string {
    return bytes < 1024 * 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}
