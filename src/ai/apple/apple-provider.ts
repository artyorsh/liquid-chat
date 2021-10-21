import { apple } from '@react-native-ai/apple';
import { generateObject, generateText } from 'ai';
import z from 'zod';

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

  public generateText(prompt: string): Promise<string> {
    return generateText({ model: apple(), prompt })
      .then(result => result.text)
      .then(text => {
        this.config.logger.debug(`generateText response:\n${text}\n prompt:\n${prompt}`);

        return text;
      }).catch(error => {
        this.config.logger.error(`generateText error:\n${error}\n prompt:\n${prompt}`);

        throw error;
      });
  }

  public generateArray<T>(prompt: string, schema: z.ZodSchema): Promise<T[]> {
    return generateObject({ model: apple(), output: 'array', prompt, schema })
      .then(response => response.object as T[])
      .then(array => {
        this.config.logger.debug(`generateArray response:\n${JSON.stringify(array)}\n prompt:\n${prompt}`);

        return array;
      }).catch(error => {
        this.config.logger.error(`generateArray error:\n${error}\n prompt:\n${prompt}`);

        throw error;
      });
  }
}
