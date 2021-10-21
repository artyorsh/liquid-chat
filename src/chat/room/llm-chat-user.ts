import { IAIProvider } from '@/ai';

import { IChatUser } from './chat-room';

export interface IChatUserConfig {
  id: number;
  name: string;
  instructions: string;
}

export class LLMChatUser implements IChatUser {

  public id: number;
  public name: string;

  constructor(private aiProvider: IAIProvider, private config: IChatUserConfig) {
    this.id = config.id;
    this.name = config.name;
  }

  public sayHello(): Promise<string> {
    const prompt: string = `
      ${this.config.instructions}
      You just joined the chat. Introduce yourself and set the context.
    `;

    return this.aiProvider.generateText(prompt);
  }

  public reply(message: string): Promise<string> {
    const prompt: string = `
      ${this.config.instructions}
      The previous user just sent this message: ${message}.
      Reply shortly, or expand the topic.
      Don't say hello in response.
    `;

    return this.aiProvider.generateText(prompt);
  }
}
