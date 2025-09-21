import { useState } from 'react';
import { View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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

  const [email, setEmail] = useState(initialValues.email);
  const [password, setPassword] = useState(initialValues.password);

  return (
    <View
      {...props}
      style={[styles.container, props.style]}>
      <View style={styles.inputs}>
        <Input
          testID='email-input'
          style={styles.input}
          value={email}
          placeholder='Email'
          keyboardType='email-address'
          onChangeText={setEmail}
          autoFocus={true}
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
          title='Login'
          onPress={() => onSubmit({ email, password })}
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
