import { useCallback } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { observer } from 'mobx-react-lite';
import { StyleSheet, UnistylesBreakpoints, UnistylesRuntime } from 'react-native-unistyles';

import { FlatList } from '@/uilib/flat-list.component';

import { IPostVM, POST_ITEM_HEIGHT, PostItem } from './post-item.component';

interface Props {
  vm: IPostListVM;
}

export interface IPostListVM {
  posts: IPostVM[];
}

const NUM_ITEMS_IN_VIEWPORT: Partial<Record<keyof UnistylesBreakpoints, number>> = {
  xs: 1.5,
  sm: 1.7,
  md: 2.3,
  lg: 2.5,
};

const ITEM_MARGIN_TOP: number = 16;

export const PostList: React.FC<Props> = observer(({ vm }) => {

  const keyExtractor = useCallback(({ post }: IPostVM) => {
    return post.id;
  }, []);

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
      numItemsInViewPort={NUM_ITEMS_IN_VIEWPORT[UnistylesRuntime.breakpoint]}
      estimatedItemSize={POST_ITEM_HEIGHT + ITEM_MARGIN_TOP}
      keyExtractor={keyExtractor}
    />
  );
});

PostList.displayName = 'PostList';

const styles = StyleSheet.create((theme, rt) => ({
  contentContainer: {
    paddingHorizontal: theme.gap(4),
    paddingBottom: rt.insets.bottom + theme.gap(4),
  },
  item: {
    marginTop: ITEM_MARGIN_TOP,
  },
}));
