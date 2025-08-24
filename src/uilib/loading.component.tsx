import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Spinner } from './spinner.component';

const FullScreenSpinner: React.FC = () => (
  <View style={styles.container}>
    <Spinner />
  </View>
);

interface Props {
  loading: boolean;
  children: React.ReactNode;
}

export const Loading: React.FC<Props> = ({ loading, children }) => (
  <>
    {loading ? <FullScreenSpinner /> : children}
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
