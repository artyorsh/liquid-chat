import * as Network from 'expo-network';

import { IProcessInfoData, IProcessInfoProvider } from './process-info.service';

export type NetworkInfoProviderId = 'NetworkInfo';

export interface INetworkInfoData extends Network.NetworkState, IProcessInfoData {
}

export class NetworkInfoProvider implements IProcessInfoProvider<INetworkInfoData> {

  public getId(): string {
    return 'NetworkInfo';
  }

  public getCurrentData = async (): Promise<INetworkInfoData> => {
    const networkState: Network.NetworkState = await Network.getNetworkStateAsync();

    return this.createNetworkInfoData(networkState);
  };

  public subscribe(callback: (data: INetworkInfoData) => void): Function {
    const subscription = Network.addNetworkStateListener((networkState: Network.NetworkState) => {
      const data = this.createNetworkInfoData(networkState);
      callback(data);
    });

    return () => {
      subscription.remove();
    };
  }

  private createNetworkInfoData(networkState: Network.NetworkState): IProcessInfoData {
    return {
      ...networkState,
      toString: () => JSON.stringify({
        ...networkState,
        type: this.getNetworkTypeDescription(networkState.type),
      }, null, 2),
    };
  }

  private getNetworkTypeDescription(networkType: Network.NetworkState['type']): string {
    switch (networkType) {
      case Network.NetworkStateType.BLUETOOTH:
        return 'Bluetooth';

      case Network.NetworkStateType.CELLULAR:
        return 'Cellular';

      case Network.NetworkStateType.ETHERNET:
        return 'Ethernet';

      case Network.NetworkStateType.NONE:
        return 'None';

      case Network.NetworkStateType.VPN:
        return 'VPN';

      case Network.NetworkStateType.WIFI:
        return 'Wi-Fi';

      case Network.NetworkStateType.WIMAX:
        return 'WiMAX';

      default:
        return 'Unknown';
    }
  }

}
