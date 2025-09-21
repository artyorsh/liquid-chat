import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native-unistyles';

import { IconButton } from '@/uilib/icon-button.component';
import { SafeArea } from '@/uilib/safe-area.component';
import { Text } from '@/uilib/text.component';

import { IRegisterFormValues, RegisterForm } from './components/register-form.component';

export interface IRegisterVM {
  title: string;
  submit(values: IRegisterFormValues): void;
  goBack(): void;
}

export const Register: React.FC<{ vm: IRegisterVM }> = observer(({ vm }) => (
  <SafeArea style={styles.container}>
    <IconButton
      icon='Back'
      onPress={vm.goBack}
    />
    <Text
      style={styles.title}
      category='heading'>
      {vm.title}
    </Text>
    <RegisterForm
      style={styles.form}
      onSubmit={vm.submit}
    />
  </SafeArea>
));

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    paddingHorizontal: theme.gap(4),
  },
  form: {
    marginTop: theme.gap(3),
    paddingBottom: rt.insets.bottom + theme.gap(6),
  },
  title: {
    textAlign: 'center',
  },
}));
