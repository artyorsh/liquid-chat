import { ILogger, ILogLevel } from '@/log';

import { IProcessInfoService, IProviderId } from '.';

export interface IProcessInfoData {
  toString(): string;
}

export interface IProcessInfoProvider<D extends IProcessInfoData = IProcessInfoData> {
  getId(): string;
  getCurrentData(): Promise<D>;
  /**
   * @returns {Function} A function to unsubscribe from the provider.
   */
  subscribe(callback: (data: D) => void): Function;
}

export type IProcessInfoProviderMap = Partial<Record<IProviderId, IProcessInfoProvider>>;

export interface IProcessInfoServiceOptions {
  providers: IProcessInfoProviderMap;
  logLevel?(providerId: IProviderId): ILogLevel;
}

export class ProcessInfoService implements IProcessInfoService {

  private providers: IProcessInfoProviderMap;
  private logLevels: Record<string, ILogLevel>;

  constructor(
    private logger: ILogger,
    options: IProcessInfoServiceOptions,
  ) {
    this.providers = options.providers;

    this.logLevels = Object.keys(this.providers).reduce((acc, providerId) => {
      const providerLogLevel = options.logLevel?.(providerId as IProviderId) || 'debug';

      return { ...acc, [providerId]: providerLogLevel };
    }, {});

    this.logCurrentData();
  }

  public startListening(): void {
    Object.values(this.providers).forEach(provider => {
      provider.subscribe(data => this.logProviderData(provider.getId(), data));
    });
  }

  public getCurrentData<D = any>(providerId: IProviderId): Promise<D> {
    const provider = this.providers[providerId];

    if (!provider) {
      return Promise.reject(new Error(`Provider not found: ${providerId}`));
    }

    return provider.getCurrentData()
      .then(data => data as D);
  }

  private logCurrentData(): void {
    Object.values(this.providers).forEach(provider => {
      provider.getCurrentData()
        .then(data => this.logProviderData(provider.getId(), data));
    });
  }

  private logProviderData = (providerId: string, data: IProcessInfoData): void => {
    const logLevel: ILogLevel = this.logLevels[providerId];
    this.logger.log(`[${providerId}]: ${data.toString()}`, logLevel);
  };

}
