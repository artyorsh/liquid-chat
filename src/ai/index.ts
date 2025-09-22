import { apple } from '@react-native-ai/apple';
import * as Device from 'expo-device';
import { ContainerModule, ResolutionContext } from 'inversify';
import { ZodSchema } from 'zod';

import { AppModule } from '@/di';
import { ILogService } from '@/log';
import { IModalService } from '@/modal';

import { AppleAIProvider } from './apple/apple-provider';
import { UserConsentMMKVStorage } from './mlc/download-consent/user-consent-mmkv-storage';
import { IUserConsentStorage, UserConsentProvider } from './mlc/download-consent/user-consent-provider';
import { IDownloadConsentProvider, IModelId, MLCAIProvider } from './mlc/mlc-provider';

export interface IAIProvider {
  getName(): string;
  generateText(prompt: string): Promise<string>;
  generateArray<T>(prompt: string, itemSchema: ZodSchema): Promise<T[]>;
}

export const AIModule = new ContainerModule(({ bind }) => {
  bind(AppModule.AI)
    .toDynamicValue(context => createAIProvider(context))
    .inSingletonScope()
    .onActivation((context: ResolutionContext, value: IAIProvider) => {
      const logger = context.get<ILogService>(AppModule.LOG).createLogger(AppModule.AI.description);
      logger.info(`provider initialized, model: ${value.getName()}`);

      return value;
    });
});

const createAIProvider = (context: ResolutionContext): IAIProvider => {
  const isAppleIntelligenceAvailable: boolean = apple.isAvailable();

  console.warn('isAppleIntelligenceAvailable', isAppleIntelligenceAvailable);

  if (isAppleIntelligenceAvailable) {
    return createAppleAIProvider(context);
  }

  if (Device.totalMemory >= process.env.EXPO_PUBLIC_AI_MEM_THRESHOLD) {
    return createMLCProvider(context);
  }
};

const createAppleAIProvider = (context: ResolutionContext): IAIProvider => {
  const logService: ILogService = context.get(AppModule.LOG);

  return new AppleAIProvider({
    logger: logService.createLogger(AppleAIProvider.name),
  });
};

const createMLCProvider = (context: ResolutionContext): IAIProvider => {
  const modelId: IModelId = process.env.EXPO_PUBLIC_AI_FALLBACK_MODEL;

  const logService: ILogService = context.get(AppModule.LOG);
  const downloadConsentProvider: IDownloadConsentProvider = createDownloadConsentProvider(context);

  return new MLCAIProvider({
    model: modelId,
    downloadConsentProvider: downloadConsentProvider,
    logger: logService.createLogger(MLCAIProvider.name),
  });
};

const createDownloadConsentProvider = (context: ResolutionContext): IDownloadConsentProvider => {
  const modelSize: number = Number(process.env.EXPO_PUBLIC_AI_FALLBACK_MODEL_SIZE);
  const modalService: IModalService = context.get(AppModule.MODAL);
  const consentStorage: IUserConsentStorage = new UserConsentMMKVStorage();

  return new UserConsentProvider(
    modalService,
    consentStorage,
    modelSize,
  );
};
