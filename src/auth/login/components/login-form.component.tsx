import { useCallback, useRef } from 'react';
import { View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLingui } from '@lingui/react/macro';

import { Button } from '@/uilib/button.component';
import { Input } from '@/uilib/input.component';

export interface ILoginFormValues {
  email: string;
  password: string;
}

interface Props extends ViewProps {
  initialValues: ILoginFormValues;
  onSubmit(values: ILoginFormValues): void;
}

export const LoginForm: React.FC<Props> = ({ initialValues, onSubmit, ...props }) => {

  const { t } = useLingui();

  const email = useRef<string>(initialValues.email);
  const password = useRef<string>(initialValues.password);

  const onEmailChange = useCallback((nextEmail: string) => {
    email.current = nextEmail;
  }, []);

  const onPasswordChange = useCallback((nextPassword: string) => {
    password.current = nextPassword;
  }, []);

  return (
    <View
      {...props}
      style={[styles.container, props.style]}>
      <View style={styles.inputs}>
        <Input
          testID='email-input'
          style={styles.input}
          defaultValue={email.current}
          placeholder={t`login.form.email_placeholder`}
          keyboardType='email-address'
          onChangeText={onEmailChange}
          autoFocus={true}
        />
        <Input
          testID='password-input'
          style={styles.input}
          defaultValue={password.current}
          placeholder={t`login.form.password_placeholder`}
          secureTextEntry={true}
          onChangeText={onPasswordChange}
        />
      </View>
      <View style={styles.submitButtonWrapper}>
        <Button
          testID='submit-button'
          title={t`login.form.submit_button`}
          onPress={() => onSubmit({ email: email.current, password: password.current })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
  },
  inputs: {
    flex: 1,
  },
  input: {
    marginTop: theme.gap(3),
  },
  submitButtonWrapper: {
    transform: [
      {
        translateY: rt.insets.ime * -1,
      },
    ],
  },
}));
