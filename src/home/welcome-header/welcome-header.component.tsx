import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { IconButton } from '@/uilib/icon-button.component';
import { Text } from '@/uilib/text.component';

interface Props extends ViewProps {
  vm: IWelcomeHeaderVM;
}

export interface IWelcomeHeaderVM {
  title: string;
  viewNotifications(): void;
  logout(): void;
}

export const WelcomeHeader: React.FC<Props> = ({ vm, ...props }) => (
  <View style={[styles.container, props.style]}>
    <Text category='heading'>
      {vm.title}
    </Text>
    <View style={styles.actionsContainer}>
      <IconButton
        testID='notifications-button'
        icon='Bell'
        onPress={vm.viewNotifications}
      />
      <IconButton
        testID='logout-button'
        icon='Logout'
        onPress={vm.logout}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 8,
  },
});
