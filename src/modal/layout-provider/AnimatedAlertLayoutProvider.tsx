import { Animated, ViewProps, ViewStyle } from 'react-native';

import { ILayoutProvider } from '../modal.component';
import { DEFAULT_OPTIONS, IAlertLayoutProviderOptions } from './animated-alert-layout-provider';

export class AnimatedAlertLayoutProvider implements ILayoutProvider {

  private animation = new Animated.Value(0);

  constructor(private options: IAlertLayoutProviderOptions = DEFAULT_OPTIONS) {
  }

  public getWrapperComponent(): React.FC<ViewProps> {
    const animationStyle: ViewStyle = this.getAnimatedStyle();

    return (props: ViewProps): React.ReactElement => (
      <Animated.View
        {...props}
        style={[props.style, animationStyle]}
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
