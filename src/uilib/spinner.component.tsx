import React from 'react';
import { ActivityIndicator, ViewProps } from 'react-native';

interface Props extends ViewProps {

}

export const Spinner: React.FC<Props> = (_props) => (
  <ActivityIndicator
    size='small'
    style={{ alignSelf: 'center' }}
  />
);
