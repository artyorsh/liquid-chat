import { apple } from '@react-native-ai/apple';
import { generateObject, generateText } from 'ai';
import { ZodSchema } from 'zod';

import { ILogger } from '@/log';

import { IAIProvider } from '..';

export interface IAppleAIProviderConfig {
  logger: ILogger;
}

export class AppleAIProvider implements IAIProvider {

  constructor(private config: IAppleAIProviderConfig) {}

  public getName(): string {
    return 'Apple Foundation';
  }

  public async generateText(prompt: string): Promise<string> {
    try {
      const result = await generateText({ model: apple(), prompt });
      const text = result.text;
      this.config.logger.debug(`generateText response:\n${text}\n prompt:\n${prompt}`);

      return text;
    } catch (error) {
      this.config.logger.error(`generateText error:\n${error}\n prompt:\n${prompt}`);

      throw error;
    }
  }

  public async generateArray<T>(prompt: string, schema: ZodSchema): Promise<T[]> {
    try {
      const response = await generateObject({ model: apple(), output: 'array', prompt, schema });
      const array = response.object as T[];
      this.config.logger.debug(`generateArray response:\n${JSON.stringify(array)}\n prompt:\n${prompt}`);

      return array;
    } catch (error) {
      this.config.logger.error(`generateArray error:\n${error}\n prompt:\n${prompt}`);

      throw error;
    }
  }
}
