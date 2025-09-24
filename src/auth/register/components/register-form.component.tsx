import { useState } from 'react';
import { View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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
          placeholder='Name'
          keyboardType='ascii-capable'
          onChangeText={setName}
          autoFocus={true}
        />
        <Input
          testID='email-input'
          style={styles.input}
          value={email}
          placeholder='Email'
          keyboardType='email-address'
          onChangeText={setEmail}
        />
        <Input
          testID='password-input'
          style={styles.input}
          value={password}
          placeholder='Password'
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.submitButtonWrapper}>
        <Button
          testID='submit-button'
          title='Register'
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
