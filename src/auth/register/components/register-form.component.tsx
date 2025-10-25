import { useCallback, useRef } from 'react';
import { View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLingui } from '@lingui/react/macro';

import { Button } from '@/uilib/button.component';
import { Input } from '@/uilib/input.component';

export interface IRegisterFormValues {
  name: string;
  email: string;
  password: string;
}

interface Props extends ViewProps {
  onSubmit(values: IRegisterFormValues): void;
}

export const RegisterForm: React.FC<Props> = ({ onSubmit, ...props }) => {

  const { t } = useLingui();

  const name = useRef<string>('');
  const email = useRef<string>('');
  const password = useRef<string>('');

  const onNameChange = useCallback((value: string) => {
    name.current = value;
  }, []);

  const onEmailChange = useCallback((value: string) => {
    email.current = value;
  }, []);

  const onPasswordChange = useCallback((value: string) => {
    password.current = value;
  }, []);

  return (
    <View
      {...props}
      style={[styles.container, props.style]}>
      <View style={styles.inputs}>
        <Input
          testID='name-input'
          style={styles.input}
          defaultValue={name.current}
          placeholder={t`register.form.name_placeholder`}
          keyboardType='ascii-capable'
          onChangeText={onNameChange}
          autoFocus={true}
        />
        <Input
          testID='email-input'
          style={styles.input}
          defaultValue={email.current}
          placeholder={t`register.form.email_placeholder`}
          keyboardType='email-address'
          onChangeText={onEmailChange}
        />
        <Input
          testID='password-input'
          style={styles.input}
          value={password.current}
          placeholder={t`register.form.password_placeholder`}
          secureTextEntry={true}
          onChangeText={onPasswordChange}
        />
      </View>
      <View style={styles.submitButtonWrapper}>
        <Button
          testID='submit-button'
          title={t`register.form.submit_button`}
          onPress={() => onSubmit({ name: name.current, email: email.current, password: password.current })}
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
