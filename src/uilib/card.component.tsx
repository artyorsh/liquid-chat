import React from 'react';
import { Pressable, StyleProp, TouchableWithoutFeedbackProps, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export interface CardProps extends TouchableWithoutFeedbackProps {
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = (props) => (
  <Pressable
    {...props}
    style={s => StyleSheet.flatten([styles.container(s), props.style])}
  />
);

const styles = StyleSheet.create(theme => ({
  container: state => ({
    overflow: 'hidden',
    borderRadius: theme.radius,
    borderWidth: 1,
    backgroundColor: state.pressed ? theme.colors.surfaceVariant : theme.colors.surface,
    borderColor: theme.colors.outline,
  }),
}));
