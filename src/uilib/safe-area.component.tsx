import React from 'react';
import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

export const SafeArea: React.FC<ViewProps> = (props) => (
  <SafeAreaView
    edges={['top']}
    {...props}
    style={[styles.container, props.style]}
  />
);

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
