import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di/model';
import { ILogService } from '@/log';

import { AppInfoProvider, AppInfoProviderId } from './app-info-provider';
import { BatteryInfoProvider, BatteryInfoProviderId } from './battery-info-provider';
import { DeviceInfoProvider, DeviceInfoProviderId } from './device-info-provider';
import { NetworkInfoProvider, NetworkInfoProviderId } from './network-info-provider';
import { IProcessInfoProvider, ProcessInfoService } from './process-info.service';

export type IProviderId =
  | DeviceInfoProviderId
  | AppInfoProviderId
  | BatteryInfoProviderId
  | NetworkInfoProviderId;

export interface IProcessInfoService {
  startListening(): void;
  getCurrentData<D = any>(providerId: IProviderId): Promise<D>;
}

export const ProcessInfoModule = new ContainerModule(bind => {
  bind<IProcessInfoService>(AppModule.PROCESS_INFO)
    .toDynamicValue(context => createProcessInfoService(context))
    .inSingletonScope();
});

const createProcessInfoService = (context: interfaces.Context): IProcessInfoService => {
  const logService: ILogService = context.container.get(AppModule.LOG);

  const providers: Record<IProviderId, IProcessInfoProvider> = {
    DeviceInfo: new DeviceInfoProvider(),
    AppInfo: new AppInfoProvider(),
    BatteryInfo: new BatteryInfoProvider(),
    NetworkInfo: new NetworkInfoProvider(),
  };

  return new ProcessInfoService(logService, {
    providers,
    logLevel: (_providerId: IProviderId) => 'info',
  });
};
