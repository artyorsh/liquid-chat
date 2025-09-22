import { string, ZodSchema } from 'zod';

import { IAIProvider } from '@/ai';
import { ILogger } from '@/log';

import { IGroupListDatasource, ITopic } from './group-list.vm';

interface GroupListLLMDataSourceConfig {
  thema: string;
  numberOfTopics: number;
  logger: ILogger;
}

export class GroupListLLMDataSource implements IGroupListDatasource {

  private itemSchema: ZodSchema<ITopic> = string().max(25);

  constructor(private aiProvider: IAIProvider, private config: GroupListLLMDataSourceConfig) {

  }

  public getTopics(): Promise<ITopic[]> {
    const instructions: string = this.getInstructions();

    return this.aiProvider.generateArray<ITopic>(instructions, this.itemSchema);
  }

  private getInstructions(): string {
    return `
      Generate array of ${this.config.numberOfTopics} chat topics on the thema of ${this.config.thema}.
      Each topic is 1-3 words length.
    `;
  }
}
