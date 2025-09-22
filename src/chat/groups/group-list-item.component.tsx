import { StyleSheet } from 'react-native-unistyles';

import { Card } from '@/uilib/card.component';
import { Text } from '@/uilib/text.component';

export interface IGroupListItemVM {
  title: string;
  viewDetails(): void;
}

export const GroupListItem: React.FC<{ vm: IGroupListItemVM }> = ({ vm }) => (
  <Card
    style={styles.container}
    onPress={vm.viewDetails}>
    <Text>
      {vm.title}
    </Text>
  </Card>
);

const styles = StyleSheet.create((theme, _rt) => ({
  container: {
    margin: theme.gap(2),
    paddingVertical: theme.gap(3),
    paddingHorizontal: theme.gap(6),
    borderRadius: 100,
  },
}));
