import React from 'react';
import { Animated, ImageSourcePropType, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import { observer } from 'mobx-react';

export interface ISplashVM {
  getImage(): ImageSourcePropType;
  getImageStyle(): ImageStyle;
  getBackgroundStyle(): ViewStyle;
}

export const Splash: React.FC<{ vm: ISplashVM }> = observer(({ vm }) => (
  <View style={[styles.container, vm.getBackgroundStyle()]}>
    <Animated.Image
      style={[styles.image, vm.getImageStyle()]}
      source={vm.getImage()}
    />
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
  },
});
