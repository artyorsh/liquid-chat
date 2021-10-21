import { Animated, ViewProps, ViewStyle } from 'react-native';

import { ILayoutProvider } from '../modal.component';

type ITimingAnimationConfig = Omit<Animated.TimingAnimationConfig, 'toValue'>;

export type IAlertLayoutProviderOptions = ITimingAnimationConfig & {
};

const DEFAULT_OPTIONS: IAlertLayoutProviderOptions = {
  useNativeDriver: true,
  duration: 300,
};

export class AnimatedAlertLayoutProvider implements ILayoutProvider {

  private animation = new Animated.Value(0);

  constructor(private options: IAlertLayoutProviderOptions = DEFAULT_OPTIONS) {
  }

  public getWrapperComponent(): React.FC<ViewProps> {
    return (props: ViewProps): React.ReactElement => (
      <Animated.View
        {...props}
        style={[props.style, this.getAnimatedStyle()]}
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

  private getAnimatedStyle(): ViewStyle {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      transform: [
        {
          scale: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.0, 1.0],
          }),
        },
      ],
    };
  }
}
