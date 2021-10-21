import { Animated, ViewProps, ViewStyle } from 'react-native';

import { ILayoutProvider } from '../modal.component';

type ITimingAnimationConfig = Omit<Animated.TimingAnimationConfig, 'toValue'>;

export type IBottomSheetLayoutProviderOptions = ITimingAnimationConfig & {
};

const DEFAULT_OPTIONS: IBottomSheetLayoutProviderOptions = {
  useNativeDriver: true,
  duration: 300,
};

export class AnimatedBottomSheetLayoutProvider implements ILayoutProvider {

  private animation = new Animated.Value(0);

  constructor(private options: IBottomSheetLayoutProviderOptions = DEFAULT_OPTIONS) {
  }

  public getWrapperComponent(): React.FC<ViewProps> {
    return (props: ViewProps): React.ReactElement => (
      <Animated.View
        {...props}
        style={[props.style, this.getAnimationStyle()]}
      />
    );
  }

  public setVisible(visible: boolean): Promise<void> {
    return new Promise(resolve => {
      Animated
        .timing(this.animation, { ...this.options, toValue: visible ? 1 : 0 })
        .start(() => resolve());
    });
  }

  private getAnimationStyle(): ViewStyle {
    return {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      opacity: this.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.0, 1.0],
      }),
      transform: [
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  }
}
