import { IMessage } from 'react-native-gifted-chat';

import { IChatRoom, IChatRoomListener } from './chat-room.vm';

export interface IChatUser {
  id: number;
  name: string;
  sayHello(topic: string): Promise<string>;
  reply(message: string): Promise<string>;
}

export interface IChatConfig {
  users: IChatUser[];
  topic: string;
  replyDelay: number;
}

export class ChatRoom implements IChatRoom {

  public get topic(): string {
    return this.config.topic;
  }

  private listener: IChatRoomListener | null = null;

  constructor(private config: IChatConfig) {
  }

  public subscribe(listener: IChatRoomListener): () => null {
    this.listener = listener;
    this.startEndlessConversation();

    return () => {
      this.listener = null;

      return null;
    };
  }

  private async startEndlessConversation(): Promise<void> {
    let lastMessage: IMessage = await this.createInitialMessage();
    this.listener?.onMessageReceived(lastMessage);

    while (this.listener) {
      await this.sleep(this.config.replyDelay);

      lastMessage = await this.replyToMessage(lastMessage);
      this.listener?.onMessageReceived(lastMessage);
    }
  }

  private createInitialMessage(): Promise<IMessage> {
    const initiator: IChatUser = this.config.users[0];
    this.listener.onUserStartedTyping(initiator.id);

    return initiator.sayHello(this.topic).then(helloMessage => {
      this.listener.onUserStoppedTyping(initiator.id);

      return this.createChatMessage(initiator, helloMessage);
    });
  }

  private replyToMessage(message: IMessage): Promise<IMessage> {
    const replier: IChatUser = this.pickReplier(message.user._id as number);
    this.listener.onUserStartedTyping(replier.id);

    return replier.reply(message.text).then(replyMessage => {
      this.listener.onUserStoppedTyping(replier.id);

      return this.createChatMessage(replier, replyMessage);
    });
  }

  private createChatMessage(user: IChatUser, text: string): IMessage {
    return {
      _id: `${user.id}-${Date.now()}`,
      text,
      createdAt: new Date(),
      user: {
        _id: user.id,
        name: user.name,
      },
    };
  }

  private pickReplier(currentUserId: number): IChatUser {
    const currentIndex = this.config.users.findIndex(user => user.id === currentUserId);
    const nextIndex = (currentIndex + 1) % this.config.users.length;

    return this.config.users[nextIndex];
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
