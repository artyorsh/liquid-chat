import React from 'react';
import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image';

interface Props extends ExpoImageProps {
}

export const Image: React.FC<Props> = (props) => (
  <ExpoImage {...props} />
);
