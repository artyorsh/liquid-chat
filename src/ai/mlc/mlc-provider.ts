import { mlc } from '@react-native-ai/mlc';
import { generateText, LanguageModel } from 'ai';
import { zocker } from 'zocker';
import z from 'zod';

import { ILogger } from '@/log';

import { IAIProvider } from '..';
import { MLCResponseParser } from './mlc-response-parser';

import type { LanguageModelV2 } from '@ai-sdk/provider';

// https://www.react-native-ai.dev/docs/mlc/model-management#available-models
export type IModelId =
  | 'Llama-3.2-3B-Instruct'
  | 'Phi-3-mini-4k-instruct'
  | 'Mistral-7B-Instruct'
  | 'Qwen2.5-1.5B-Instruct';

export interface IMLCAIProviderConfig {
  model: IModelId;
  downloadConsentProvider: IDownloadConsentProvider;
  logger: ILogger;
}

export interface IDownloadConsentProvider {
  isAllowed(): Promise<boolean>;
  /**
   * @returns resolves if allowed to download, rejects otherwise.
   */
  requestDownload(modelId: IModelId): Promise<void>;
}

export interface IMLCResponseParser {
  parse(text: string): object;
}

export class MLCAIProvider implements IAIProvider {

  private llm: LanguageModel;
  private parser: IMLCResponseParser = new MLCResponseParser();

  constructor(private config: IMLCAIProviderConfig) {
  }

  public getName(): string {
    return this.config.model;
  }

  public generateText(prompt: string): Promise<string> {
    return this.getModel()
      .then(model => generateText({ model, prompt }))
      .then(result => result.text)
      .then(text => {
        this.config.logger.debug(`generateText response:\n${text}\n prompt:\n${prompt}`);

        return text;
      });
  }

  public generateArray<T>(prompt: string, itemSchema: z.ZodSchema): Promise<T[]> {
    const example = zocker(itemSchema).generate();

    const instructions: string = `
      ${prompt}

      IMPORTANT:
        - Output must be **strictly valid JSON**, directly parsable with JSON.parse.
        - The JSON must have the following format: ${JSON.stringify([example])}
        - **Do NOT** include any text outside the JSON object (no markdown wrappers, comments, or extra text).
        - Avoid special characters like quotes ("), backslashes (\\), or any characters that might break JSON.
    `;

    return this.getModel().then(model => {
      return generateText({ model, prompt: instructions }).then(result => {
        const response: string = result.text;
        this.config.logger.debug(`generateArray response:\n${response}\n prompt:\n${instructions}`);

        return this.parser.parse(response) as T[];
      }).catch(e => {
        this.config.logger.error(`generateArray error: ${e}, instructions: ${instructions}`);

        return [];
      });
    });
  }

  private getModel(): Promise<LanguageModel> {
    if (this.llm) {
      return Promise.resolve(this.llm);
    }

    return this.downloadModel(this.config.model).then(llm => {
      this.llm = llm;

      return llm;
    });
  }

  private downloadModel(modelId: IModelId): Promise<LanguageModelV2> {
    const llm = mlc.languageModel(modelId);

    const download = (): Promise<void> => llm.download(progress => logDownloadProgress(progress.status));
    const logDownloadProgress = (status): void => this.config.logger?.info(`Status: ${status}`);

    const downloadConsentProvider: IDownloadConsentProvider = this.config.downloadConsentProvider;

    return downloadConsentProvider.isAllowed().then(allowed => {
      if (allowed) {
        return download();
      }

      return downloadConsentProvider.requestDownload(modelId).then(() => download());
    }).then(() => {
      return llm.prepare().then(() => llm);
    });
  }
}
