import { createElement } from 'react';
import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IAIProvider } from '@/ai';
import { IRouter } from '@/router';

import { ChatRoom, IChatUser } from './chat-room';
import { ChatRoom as ChatRoomComponent, IChatRoomVM } from './chat-room.component';
import { ChatRoomVM, IChatRoom } from './chat-room.vm';
import { LLMChatUser } from './llm-chat-user';

import { faker } from '@faker-js/faker';

export type IChatRoomRoute = '/chats/:id';

export const createChatRoomScreen = (context: ResolutionContext): React.FC => {
  return ({ route }: any) => {
    const topic: string = route.params.topic;
    const viewModel: IChatRoomVM = createChatRoomViewModel(topic, context);

    return createElement(ChatRoomComponent, { vm: viewModel });
  };
};

const createChatRoomViewModel = (topic: string, context: ResolutionContext): IChatRoomVM => {
  const router = context.get<IRouter>(AppModule.ROUTER);

  const numberOfUsers: number = faker.number.int({ min: 2, max: 10 });
  const users: IChatUser[] = Array.from({ length: numberOfUsers }, () => createChatUser(topic, context));

  const room: IChatRoom = new ChatRoom({
    topic,
    users,
    replyDelay: 5000,
  });

  return new ChatRoomVM(router, room);
};

const createChatUser = (topic: string, context: ResolutionContext): IChatUser => {
  const aiProvider = context.get<IAIProvider>(AppModule.AI);

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
