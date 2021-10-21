import React from 'react';
import { interfaces } from 'inversify';

import { AppModule } from '@/di';
import { IAIProvider } from '@/ai';
import { IRouter } from '@/router';

import { ChatRoom, IChatUser } from './chat-room';
import { ChatRoom as ChatRoomComponent, IChatRoomVM } from './chat-room.component';
import { ChatRoomVM, IChatRoom } from './chat-room.vm';
import { LLMChatUser } from './llm-chat-user';

import { faker } from '@faker-js/faker';

export type IChatRoomRoute = '/chats/:id';

export const createChatRoomScreen = (context: interfaces.Context): React.FC => {
  return ({ route }: any) => {
    const topic: string = route.params.topic;
    const vm: IChatRoomVM = createChatRoomVM(topic, context);

    return React.createElement(ChatRoomComponent, { vm });
  };
};

const createChatRoomVM = (topic: string, context: interfaces.Context): IChatRoomVM => {
  const router = context.container.get<IRouter>(AppModule.ROUTER);

  const numberOfUsers: number = faker.number.int({ min: 2, max: 10 });
  const users: IChatUser[] = Array.from({ length: numberOfUsers }, () => createChatUser(topic, context));

  const room: IChatRoom = new ChatRoom({
    topic,
    users,
    replyDelay: 5000,
  });

  return new ChatRoomVM(router, room);
};

const createChatUser = (topic: string, context: interfaces.Context): IChatUser => {
  const aiProvider = context.container.get<IAIProvider>(AppModule.AI);

  const name: string = faker.person.firstName();

  const instructions: string = `
    Your name is ${name}.
    You live in a chat together with other people talking about ${topic}.
    Don't write very long messages, limit your responses to a few sentences.
  `;

  return new LLMChatUser(aiProvider, {
    id: faker.number.int(),
    name,
    instructions,
  });
};
