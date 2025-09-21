import { observer } from 'mobx-react';

import { IPostListVM, PostList } from '@/posts/post-list/post-list.component';
import { Loading } from '@/uilib/loading.component';
import { SafeArea } from '@/uilib/safe-area.component';

import { IWelcomeHeaderVM, WelcomeHeader } from './welcome-header/welcome-header.component';

export interface IHomeVM {
  loading: boolean;
  welcomeHeader: IWelcomeHeaderVM;
  posts: IPostListVM;
}

export const Home: React.FC<{ vm: IHomeVM }> = observer(({ vm }) => (
  <SafeArea>
    <WelcomeHeader vm={vm.welcomeHeader} />
    <Loading loading={vm.loading}>
      <PostList vm={vm.posts} />
    </Loading>
  </SafeArea>
));
