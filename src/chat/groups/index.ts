import React from 'react';
import { interfaces } from 'inversify';

import { AppModule } from '@/di';
import { IAIProvider } from '@/ai';
import { ILogService } from '@/log';
import { IRouter } from '@/router';

import { GroupList, IGroupListVM } from './group-list.component';
import { GroupListVM, IGroupListDatasource } from './group-list.vm';
import { GroupListLLMDataSource } from './group-list-llm-datasource';

export type IChatGroupsRoute = '/chats';

export const createChatGroupsScreen = (context: interfaces.Context): React.FC => {
  return () => React.createElement(GroupList, { vm: createGroupsListVM(context) });
};

const createGroupsListVM = (context: interfaces.Context): IGroupListVM => {
  const aiProvider: IAIProvider = context.container.get(AppModule.AI);
  const logService: ILogService = context.container.get(AppModule.LOG);

  const router: IRouter = context.container.get(AppModule.ROUTER);
  const dataSource: IGroupListDatasource = new GroupListLLMDataSource(aiProvider, {
    thema: 'Health',
    numberOfTopics: 10,
    logger: logService.createLogger(GroupListLLMDataSource.name),
  });

  return new GroupListVM(router, dataSource);
};
