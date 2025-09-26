import { StyleSheet, View, ViewProps } from 'react-native';
import { observer } from 'mobx-react';
import { i18n } from '@lingui/core';

import { IconButton } from '@/uilib/icon-button.component';
import { Text } from '@/uilib/text.component';

interface Props extends ViewProps {
  vm: IWelcomeHeaderVM;
}

export interface IWelcomeHeaderVM {
  title: string;
  unreadNotifications: number;
  viewNotifications(): void;
  logout(): void;
}

export const WelcomeHeader: React.FC<Props> = observer(({ vm, ...props }) => (
  <View style={[styles.container, props.style]}>
    <View>
      <Text category='heading'>
        {vm.title}
      </Text>
      <Text
        type='hint'
        category='paragraph'>
        {i18n.t('home.welcome_header.unread_notifications', { count: vm.unreadNotifications })}
      </Text>
    </View>
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
));

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
