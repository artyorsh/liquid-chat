import { createElement, useMemo } from 'react';
import { ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IAIProvider } from '@/ai';
import { ILogService } from '@/log';
import { IRouter } from '@/router';

import { GroupList, IGroupListVM } from './group-list.component';
import { GroupListVM, IGroupListDatasource } from './group-list.vm';
import { GroupListLLMDataSource } from './group-list-llm-datasource';

export type IChatGroupsRoute = '/chats';

export const createChatGroupsScreen = (context: ResolutionContext): React.FC => {
  return () => {
    const viewModel: IGroupListVM = useMemo(() => createGroupsListViewModel(context), []);

    return createElement(GroupList, { vm: viewModel });
  };
};

const createGroupsListViewModel = (context: ResolutionContext): IGroupListVM => {
  const aiProvider: IAIProvider = context.get(AppModule.AI);
  const logService: ILogService = context.get(AppModule.LOG);

  const router: IRouter = context.get(AppModule.ROUTER);
  const dataSource: IGroupListDatasource = new GroupListLLMDataSource(aiProvider, {
    thema: 'Health',
    numberOfTopics: 10,
    logger: logService.createLogger(GroupListLLMDataSource.name),
  });

  return new GroupListVM(router, dataSource);
};
