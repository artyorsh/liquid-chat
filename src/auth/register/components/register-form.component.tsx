import { useState } from 'react';
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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View
      {...props}
      style={[styles.container, props.style]}>
      <View style={styles.inputs}>
        <Input
          testID='name-input'
          style={styles.input}
          value={name}
          placeholder={t`register.form.name_placeholder`}
          keyboardType='ascii-capable'
          onChangeText={setName}
          autoFocus={true}
        />
        <Input
          testID='email-input'
          style={styles.input}
          value={email}
          placeholder={t`register.form.email_placeholder`}
          keyboardType='email-address'
          onChangeText={setEmail}
        />
        <Input
          testID='password-input'
          style={styles.input}
          value={password}
          placeholder={t`register.form.password_placeholder`}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.submitButtonWrapper}>
        <Button
          testID='submit-button'
          title={t`register.form.submit_button`}
          onPress={() => onSubmit({ name, email, password })}
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
