import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native-unistyles';

import { IPostVM, PostItem } from './post-item.component';

interface Props {
  vm: IPostsListVM;
}

export interface IPostsListVM {
  posts: IPostVM[];
}

export const PostsList: React.FC<Props> = observer(({ vm }) => {

  const renderItem = ({ item }: ListRenderItemInfo<IPostVM>): React.ReactElement => (
    <PostItem
      testID='post-item'
      style={styles.item}
      vm={item}
    />
  );

  return (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={vm.posts}
      renderItem={renderItem}
    />
  );
});

const styles = StyleSheet.create((theme, rt) => ({
  contentContainer: {
    paddingHorizontal: theme.gap(4),
    paddingBottom: rt.insets.bottom + theme.gap(4),
  },
  item: {
    marginTop: theme.gap(4),
  },
}));
