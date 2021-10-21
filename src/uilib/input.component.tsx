import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface InputProps extends TextInputProps {}

export const Input: React.FC<InputProps> = (props) => {
  const [focused, setFocused] = React.useState(false);
  styles.useVariants({ focused, editable: props.editable });

  return (
    <TextInput
      {...props}
      style={[styles.container, props.style]}
      placeholderTextColor={styles.placeholder.color}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    ...theme.typography.control(rt.fontScale),
    lineHeight: undefined,
    padding: theme.gap(3),
    borderRadius: theme.radius,
    borderWidth: 1,
    variants: {
      focused: {
        false: {
          borderColor: theme.colors.outline,
          color: theme.colors.onBackground,
        },
        true: {
          borderColor: theme.colors.primaryVariant,
          color: theme.colors.primary,
        },
      },
      editable: {
        false: {
          backgroundColor: theme.colors.disabled,
          borderColor: theme.colors.disabled,
        },
      },
    },
  },
  placeholder: {
    variants: {
      focused: {
        false: {
          color: theme.colors.hint,
        },
        true: {
          color: theme.colors.primary,
        },
      },
    },
  },
}));
