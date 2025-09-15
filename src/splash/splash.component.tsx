import React from 'react';
import { Animated, ImageSourcePropType, ImageStyle, View, ViewStyle } from 'react-native';
import { observer } from 'mobx-react';
import { StyleSheet, UnistylesTheme, useUnistyles } from 'react-native-unistyles';

export interface ISplashVM {
  getImage(theme: UnistylesTheme): ImageSourcePropType;
  getImageStyle(theme: UnistylesTheme): ImageStyle;
  getBackgroundStyle(theme: UnistylesTheme): ViewStyle;
}

export const Splash: React.FC<{ vm: ISplashVM }> = observer(({ vm }) => {
  const { theme } = useUnistyles();

  return (
    <View style={[styles.container, vm.getBackgroundStyle(theme)]}>
      <Animated.Image
        style={[styles.image, vm.getImageStyle(theme)]}
        source={vm.getImage(theme)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
  },
});
