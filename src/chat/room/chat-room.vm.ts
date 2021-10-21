import { GiftedChat, IMessage as GiftedChatMessage } from 'react-native-gifted-chat';
import { makeAutoObservable, observable } from 'mobx';

import { INavigationLifecycleListener, IRouter } from '@/router';

import { IChatRoomVM } from './chat-room.component';

export interface IChatRoomListener {
  onMessageReceived(message: GiftedChatMessage): void;
  onUserStartedTyping(userId: number): void;
  onUserStoppedTyping(userId: number): void;
}

export interface IChatRoom {
  topic: string;
  /**
   * @returns a function to unsubscribe.
   */
  subscribe(listener: IChatRoomListener): () => null;
}

export class ChatRoomVM implements IChatRoomVM, INavigationLifecycleListener, IChatRoomListener {

  public topic: string;

  @observable public messages: GiftedChatMessage[] = [];
  @observable public isTyping: boolean = false;

  private removeChatSubscription: Function;

  constructor(
    private router: IRouter,
    private room: IChatRoom,
  ) {
    this.topic = room.topic;
    router.subscribe('/chats/:id', this);

    makeAutoObservable(this);
  }

  public onFocus = (): void => {
    this.removeChatSubscription = this.room.subscribe(this);
  };

  public onBlur = (): void => {
    this.removeChatSubscription?.();
  };

  public goBack = (): void => {
    this.router.goBack();
  };

  public onMessageReceived(message: GiftedChatMessage): void {
    this.messages = GiftedChat.append(this.messages, [message]);
  }

  public onUserStartedTyping(_userId: number): void {
    this.isTyping = true;
  }

  public onUserStoppedTyping(_userId: number): void {
    this.isTyping = false;
  }
}
