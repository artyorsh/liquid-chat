import { FlatList, ListRenderItemInfo } from 'react-native';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native-unistyles';
import { ImageBackground } from 'expo-image';

import { Card } from '@/uilib/card.component';
import { Loading } from '@/uilib/loading.component';
import { Text } from '@/uilib/text.component';

import { GroupListItem, IGroupListItemVM } from './group-list-item.component';

export interface IGroupListVM {
  loading: boolean;
  groups: IGroupListItemVM[];
}

export const GroupList: React.FC<{ vm: IGroupListVM }> = observer(({ vm }) => {

  const renderGroup = (info: ListRenderItemInfo<IGroupListItemVM>): React.ReactElement => (
    <GroupListItem
      key={info.index}
      vm={info.item}
    />
  );

  const renderHeader = (): React.ReactElement => (
    <Card style={styles.header}>
      <Text
        style={styles.headerText}
        category='subheading'>
        {'Select a topic'}
      </Text>
    </Card>
  );

  return (
    <ImageBackground
      style={styles.container}
      source={require('../background.jpg')}>
      <Loading loading={vm.loading}>
        <FlatList
          data={vm.groups}
          renderItem={renderGroup}
          ListHeaderComponent={renderHeader}
        />
      </Loading>
    </ImageBackground>
  );
});

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
    paddingTop: runtime.insets.top,
    paddingHorizontal: theme.gap(2),
  },
  header: {
    margin: theme.gap(2),
    paddingVertical: theme.gap(6),
    paddingHorizontal: theme.gap(6),
  },
  headerText: {
    textAlign: 'center',
  },
}));
