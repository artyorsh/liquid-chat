import React from 'react';
import { observer } from 'mobx-react';

import { Loading } from '@/uilib/loading.component';
import { SafeArea } from '@/uilib/safe-area.component';

import { IPostsListVM, PostsList } from './posts-list/posts-list.component';
import { IWelcomeHeaderVM, WelcomeHeader } from './welcome-header/welcome-header.component';

export interface IHomeVM {
  loading: boolean;
  welcomeHeader: IWelcomeHeaderVM;
  posts: IPostsListVM;
}

export const Home: React.FC<{ vm: IHomeVM }> = observer(({ vm }) => {

  return (
    <SafeArea>
      <WelcomeHeader vm={vm.welcomeHeader} />
      <Loading loading={vm.loading}>
        <PostsList vm={vm.posts} />
      </Loading>
    </SafeArea>
  );
});
