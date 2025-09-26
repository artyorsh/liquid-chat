import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native-unistyles';
import { i18n } from '@lingui/core';

import { Button } from '@/uilib/button.component';
import { SafeArea } from '@/uilib/safe-area.component';
import { Text } from '@/uilib/text.component';

export interface IWelcomeVM {
  login(): void;
  register(): void;
}

export const Welcome: React.FC<{ vm: IWelcomeVM }> = observer(({ vm }) => (
  <SafeArea style={styles.container}>
    <Text
      style={styles.title}
      category='heading'>
      {i18n.t('welcome.title')}
    </Text>
    <Button
      testID='register-button'
      title={i18n.t('welcome.register_button')}
      onPress={() => vm.register()}
    />
    <Button
      style={styles.loginButton}
      testID='login-button'
      type='secondary'
      onPress={() => vm.login()}
      title={i18n.t('welcome.login_button')}
    />
  </SafeArea>
));

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    paddingHorizontal: theme.gap(4),
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginTop: theme.gap(10),
  },
  loginButton: {
    marginTop: theme.gap(3),
    marginBottom: rt.insets.bottom + theme.gap(6),
  },
}));
