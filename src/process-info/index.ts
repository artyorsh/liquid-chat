import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { ILogger, ILogLevel, ILogService } from '@/log';

import { IProcessInfoProvider, ProcessInfoService } from './process-info.service';
import { AppInfoProvider, AppInfoProviderId } from './provider/app-info-provider';
import { BatteryInfoProvider, BatteryInfoProviderId } from './provider/battery-info-provider';
import { DeviceInfoProvider, DeviceInfoProviderId } from './provider/device-info-provider';
import { NetworkInfoProvider, NetworkInfoProviderId } from './provider/network-info-provider';

export type IProviderId =
  | DeviceInfoProviderId
  | AppInfoProviderId
  | BatteryInfoProviderId
  | NetworkInfoProviderId;

export interface IProcessInfoService {
  startListening(): void;
  getCurrentData<D = any>(providerId: IProviderId): Promise<D>;
}

export const ProcessInfoModule = new ContainerModule(({ bind }) => {
  bind<IProcessInfoService>(AppModule.PROCESS_INFO)
    .toDynamicValue(context => createProcessInfoService(context))
    .inSingletonScope();
});

const createProcessInfoService = (context: ResolutionContext): IProcessInfoService => {
  const logService: ILogService = context.get(AppModule.LOG);
  const logger: ILogger = logService.createLogger(ProcessInfoService.name);
  const logLevel: ILogLevel = 'info';

  const providers: Record<IProviderId, IProcessInfoProvider> = {
    DeviceInfo: new DeviceInfoProvider(),
    AppInfo: new AppInfoProvider(),
    BatteryInfo: new BatteryInfoProvider(),
    NetworkInfo: new NetworkInfoProvider(),
  };

  return new ProcessInfoService(logger, {
    providers,
    logLevel: (_providerId: IProviderId) => logLevel,
  });
};
