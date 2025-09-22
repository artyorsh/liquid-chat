import { Pressable, StyleProp, TouchableWithoutFeedbackProps, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { GlassView } from 'expo-glass-effect';

export interface CardProps extends TouchableWithoutFeedbackProps {
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({ children, ...props }) => (
  <GlassView
    {...props}
    style={[styles.container, props.style]}
    glassEffectStyle='clear'>
    <Pressable onPress={props.onPress}>
      {children}
    </Pressable>
  </GlassView>
);

const styles = StyleSheet.create(theme => ({
  container: {
    overflow: 'hidden',
    borderRadius: theme.radius,
  },
}));
