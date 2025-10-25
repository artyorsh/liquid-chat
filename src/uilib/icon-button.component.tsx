import { memo } from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { Button, ButtonProps } from './button.component';

export interface IconButtonProps extends Omit<ButtonProps, 'title'> {
}

export const IconButton: React.FC<IconButtonProps> = memo((props) => (
  <Button
    type='tertiary'
    {...props}
    style={[styles.container, props.style]}
  />
));

IconButton.displayName = 'IconButton';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
});
