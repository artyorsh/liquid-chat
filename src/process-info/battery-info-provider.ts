import * as Battery from 'expo-battery';

import { IProcessInfoData, IProcessInfoProvider } from './process-info.service';

export type BatteryInfoProviderId = 'BatteryInfo';

export interface IBatteryInfoData extends Battery.PowerState, IProcessInfoData {
}

export class BatteryInfoProvider implements IProcessInfoProvider<IBatteryInfoData> {

  private currentData: IBatteryInfoData;

  public getId(): string {
    return 'BatteryInfo';
  }

  public getCurrentData = async (): Promise<IBatteryInfoData> => {
    const powerState: Battery.PowerState = await Battery.getPowerStateAsync();
    this.currentData = this.createBatteryInfoData(powerState);

    return this.currentData;
  };

  public subscribe(callback: (data: IBatteryInfoData) => void): Function {
    const batteryLevelSubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      this.currentData = this.createBatteryInfoData({ ...this.currentData, batteryLevel });
      callback(this.currentData);
    });

    const batteryStateSubscription = Battery.addBatteryStateListener(({ batteryState }) => {
      this.currentData = { ...this.currentData, batteryState };
      callback(this.currentData);
    });

    const lowPowerModeSubscription = Battery.addLowPowerModeListener(({ lowPowerMode }) => {
      this.currentData = { ...this.currentData, lowPowerMode };
      callback(this.currentData);
    });

    return () => {
      batteryLevelSubscription.remove();
      batteryStateSubscription.remove();
      lowPowerModeSubscription.remove();
    };
  }

  private createBatteryInfoData(powerState: Battery.PowerState): IBatteryInfoData {
    return {
      ...powerState,
      toString: () => JSON.stringify({
        ...powerState,
        batteryState: this.getBatteryStateDescription(powerState.batteryState),
        batteryLevel: `${powerState.batteryLevel * 100}%`,
      }, null, 2),
    };
  }

  private getBatteryStateDescription(batteryState: Battery.BatteryState): string {
    switch (batteryState) {
      case Battery.BatteryState.UNPLUGGED:
        return 'Unplugged';

      case Battery.BatteryState.CHARGING:
        return 'Charging';

      case Battery.BatteryState.FULL:
        return 'Full';

      default:
        return 'Unknown';
    }
  }
}
