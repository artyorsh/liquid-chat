import React from 'react';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di';

import { createChatGroupsScreen, IChatGroupsRoute } from './groups';
import { createChatRoomScreen, IChatRoomRoute } from './room';

export type IChatRoute =
  | IChatGroupsRoute
  | IChatRoomRoute;

export const ChatModule = new ContainerModule(bind => {
  bind<interfaces.Factory<React.FC>>(AppModule.CHAT_GROUPS_SCREEN)
    .toFactory(context => createChatGroupsScreen(context));

  bind<interfaces.Factory<React.FC>>(AppModule.CHAT_SCREEN)
    .toFactory(context => createChatRoomScreen(context));
});
