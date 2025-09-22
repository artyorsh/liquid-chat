import { mlc } from '@react-native-ai/mlc';
import { generateText, LanguageModel } from 'ai';
import { zocker } from 'zocker';
import { ZodSchema } from 'zod';

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

  public async generateText(prompt: string): Promise<string> {
    const model: LanguageModel = await this.getModel();
    const { text } = await generateText({ model, prompt });

    this.config.logger.debug(`generateText response:\n${text}\n prompt:\n${prompt}`);

    return text;
  }

  public async generateArray<T>(prompt: string, itemSchema: ZodSchema): Promise<T[]> {
    const example = zocker(itemSchema).generate();

    const instructions: string = `
      ${prompt}

      IMPORTANT:
        - Output must be **strictly valid JSON**, directly parsable with JSON.parse.
        - The JSON must have the following format: ${JSON.stringify([example])}
        - **Do NOT** include any text outside the JSON object (no markdown wrappers, comments, or extra text).
        - Avoid special characters like quotes ("), backslashes (\\), or any characters that might break JSON.
    `;

    const model = await this.getModel();
    try {
      const result = await generateText({ model, prompt: instructions });
      const response: string = result.text;
      this.config.logger.debug(`generateArray response:\n${response}\n prompt:\n${instructions}`);

      return this.parser.parse(response) as T[];
    } catch (e) {
      this.config.logger.error(`generateArray error: ${e}, instructions: ${instructions}`);

      return [];
    }
  }

  private async getModel(): Promise<LanguageModel> {
    if (this.llm) {
      return Promise.resolve(this.llm);
    }

    this.llm = await this.downloadModel(this.config.model);

    return this.llm;
  }

  private async downloadModel(modelId: IModelId): Promise<LanguageModelV2> {
    const llm = mlc.languageModel(modelId);

    const download = (): Promise<void> => llm.download(progress => logDownloadProgress(progress.status));
    const logDownloadProgress = (status: string): void => this.config.logger?.info(`Status: ${status}`);

    const downloadConsentProvider: IDownloadConsentProvider = this.config.downloadConsentProvider;
    const isDownloadAllowed: boolean = await downloadConsentProvider.isAllowed();

    if (!isDownloadAllowed) {
      await downloadConsentProvider.requestDownload(modelId);
    }

    await download();
    await llm.prepare();

    return llm;
  }
}
