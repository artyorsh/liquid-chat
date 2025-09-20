import { addBatteryLevelListener, addBatteryStateListener, addLowPowerModeListener, BatteryState, getPowerStateAsync, PowerState } from 'expo-battery';

import { IProcessInfoData, IProcessInfoProvider } from '../process-info.service';

export type BatteryInfoProviderId = 'BatteryInfo';

export interface IBatteryInfoData extends PowerState, IProcessInfoData {
}

export class BatteryInfoProvider implements IProcessInfoProvider<IBatteryInfoData> {

  private currentData: IBatteryInfoData;

  public getId(): string {
    return 'BatteryInfo';
  }

  public getCurrentData = async (): Promise<IBatteryInfoData> => {
    const powerState: PowerState = await getPowerStateAsync();
    this.currentData = this.createBatteryInfoData(powerState);

    return this.currentData;
  };

  public subscribe(callback: (data: IBatteryInfoData) => void): Function {
    const batteryLevelSubscription = addBatteryLevelListener(({ batteryLevel }) => {
      this.currentData = this.createBatteryInfoData({ ...this.currentData, batteryLevel });
      callback(this.currentData);
    });

    const batteryStateSubscription = addBatteryStateListener(({ batteryState }) => {
      this.currentData = { ...this.currentData, batteryState };
      callback(this.currentData);
    });

    const lowPowerModeSubscription = addLowPowerModeListener(({ lowPowerMode }) => {
      this.currentData = { ...this.currentData, lowPowerMode };
      callback(this.currentData);
    });

    return () => {
      batteryLevelSubscription.remove();
      batteryStateSubscription.remove();
      lowPowerModeSubscription.remove();
    };
  }

  private createBatteryInfoData(powerState: PowerState): IBatteryInfoData {
    return {
      ...powerState,
      toString: () => JSON.stringify({
        ...powerState,
        batteryState: this.getBatteryStateDescription(powerState.batteryState),
        batteryLevel: `${powerState.batteryLevel * 100}%`,
      }, null, 2),
    };
  }

  private getBatteryStateDescription(batteryState: BatteryState): string {
    switch (batteryState) {
      case BatteryState.UNPLUGGED:
        return 'Unplugged';

      case BatteryState.CHARGING:
        return 'Charging';

      case BatteryState.FULL:
        return 'Full';

      default:
        return 'Unknown';
    }
  }
}
