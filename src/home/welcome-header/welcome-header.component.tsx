import { StyleSheet, View, ViewProps } from 'react-native';
import { observer } from 'mobx-react';
import { useLingui } from '@lingui/react/macro';

import { IconButton } from '@/uilib/icon-button.component';
import { Text } from '@/uilib/text.component';

interface Props extends ViewProps {
  vm: IWelcomeHeaderVM;
}

export interface IWelcomeHeaderVM {
  userName: string;
  unreadNotifications: number;
  viewNotifications(): void;
  logout(): void;
}

export const WelcomeHeader: React.FC<Props> = observer(({ vm, ...props }) => {
  const { t } = useLingui();

  return (
    <View style={[styles.container, props.style]}>
      <View>
        <Text category='heading'>
          {t`home.welcome.title ${vm.userName}`}
        </Text>
        <Text type='hint'>
          {t`home.welcome.unread_notifications ${vm.unreadNotifications}`}
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
  );
});

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
