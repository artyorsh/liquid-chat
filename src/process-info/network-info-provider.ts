import { addNetworkStateListener, getNetworkStateAsync, NetworkState, NetworkStateType } from 'expo-network';

import { IProcessInfoData, IProcessInfoProvider } from './process-info.service';

export type NetworkInfoProviderId = 'NetworkInfo';

export interface INetworkInfoData extends NetworkState, IProcessInfoData {
}

export class NetworkInfoProvider implements IProcessInfoProvider<INetworkInfoData> {

  public getId(): string {
    return 'NetworkInfo';
  }

  public getCurrentData = async (): Promise<INetworkInfoData> => {
    const networkState: NetworkState = await getNetworkStateAsync();

    return this.createNetworkInfoData(networkState);
  };

  public subscribe(callback: (data: INetworkInfoData) => void): Function {
    const subscription = addNetworkStateListener((networkState: NetworkState) => {
      const data = this.createNetworkInfoData(networkState);
      callback(data);
    });

    return () => {
      subscription.remove();
    };
  }

  private createNetworkInfoData(networkState: NetworkState): IProcessInfoData {
    return {
      ...networkState,
      toString: () => JSON.stringify({
        ...networkState,
        type: this.getNetworkTypeDescription(networkState.type),
      }, null, 2),
    };
  }

  private getNetworkTypeDescription(networkType: NetworkState['type']): string {
    switch (networkType) {
      case NetworkStateType.BLUETOOTH:
        return 'Bluetooth';

      case NetworkStateType.CELLULAR:
        return 'Cellular';

      case NetworkStateType.ETHERNET:
        return 'Ethernet';

      case NetworkStateType.NONE:
        return 'None';

      case NetworkStateType.VPN:
        return 'VPN';

      case NetworkStateType.WIFI:
        return 'Wi-Fi';

      case NetworkStateType.WIMAX:
        return 'WiMAX';

      default:
        return 'Unknown';
    }
  }
}
