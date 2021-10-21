import React from 'react';
import { Pressable, PressableProps, PressableStateCallbackType, StyleProp, Text, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { IconName, Icons } from './icon.component';

export type ButtonType =
  | 'primary'
  | 'secondary'
  | 'tertiary';

export interface ButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  type?: ButtonType;
  title?: string;
  icon?: IconName;
}

export const Button: React.FC<ButtonProps> = ({ type = 'primary', disabled = false, title, icon, ...props }) => {
  styles.useVariants({ type, disabled });

  const renderBody = (state: PressableStateCallbackType): React.ReactElement => {
    const IconComponent = Icons[icon];

    return (
      <>
        {title && (
          <Text
            style={styles.text(state)}
            children={title}
          />
        )}
        {icon && <IconComponent style={styles.icon(state)} />}
      </>
    );
  };

  return (
    <Pressable
      {...props}
      style={s => StyleSheet.flatten([styles.container(s), props.style])}
      disabled={disabled}>
      {renderBody}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: state => ({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.gap(1.5),
    paddingVertical: theme.gap(3),
    borderRadius: theme.radius,
    borderWidth: 1,
    variants: {
      type: {
        primary: {
          backgroundColor: state.pressed ? theme.colors.primaryVariant : theme.colors.primary,
          borderColor: state.pressed ? theme.colors.primaryVariant : theme.colors.primary,
        },
        secondary: {
          backgroundColor: 'transparent',
          borderColor: state.pressed ? theme.colors.primaryVariant : theme.colors.primary,
        },
        tertiary: {
          backgroundColor: state.pressed ? theme.colors.surfaceVariant : 'transparent',
          borderColor: 'transparent',
        },
      },
      disabled: {
        true: {
          backgroundColor: theme.colors.disabled,
          borderColor: theme.colors.disabled,
        },
      },
    },
  }),
  text: state => ({
    ...theme.typography.control(rt.fontScale),
    textAlign: 'center',
    marginHorizontal: theme.gap(1.5),
    variants: {
      type: {
        primary: {
          color: theme.colors.onPrimary,
        },
        secondary: {
          color: state.pressed ? theme.colors.primaryVariant : theme.colors.primary,
        },
        tertiary: {
          color: state.pressed ? theme.colors.primaryVariant : theme.colors.primary,
        },
      },
      disabled: {
        true: {
          color: theme.colors.onDisabled,
        },
      },
    },
  }),
  icon: state => ({
    fontSize: rt.fontScale * 20,
    marginHorizontal: theme.gap(1.5),
    variants: {
      type: {
        primary: {
          color: theme.colors.onPrimary,
        },
        secondary: {
          color: state.pressed ? theme.colors.primaryVariant : theme.colors.primary,
        },
        tertiary: {
          color: state.pressed ? theme.colors.primaryVariant : theme.colors.primary,
        },
      },
      disabled: {
        true: {
          color: theme.colors.onDisabled,
        },
      },
    },
  }),
}));
