import { observer } from 'mobx-react-lite';
import { StyleSheet } from 'react-native-unistyles';
import { useLingui } from '@lingui/react/macro';

import { IconButton } from '@/uilib/icon-button.component';
import { SafeArea } from '@/uilib/safe-area.component';
import { Text } from '@/uilib/text.component';

import { ILoginFormValues, LoginForm } from './components/login-form.component';

export interface ILoginVM {
  initialValues: ILoginFormValues;
  submit(values: ILoginFormValues): void;
  goBack(): void;
}

export const Login: React.FC<{ vm: ILoginVM }> = observer(({ vm }) => {
  const { t } = useLingui();

  return (
    <SafeArea style={styles.container}>
      <IconButton
        icon='Back'
        onPress={vm.goBack}
      />
      <Text
        style={styles.title}
        category='heading'>
        {t`login.title`}
      </Text>
      <LoginForm
        style={styles.form}
        initialValues={vm.initialValues}
        onSubmit={vm.submit}
      />
    </SafeArea>
  );
});

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
