import { Animated, ViewProps, ViewStyle } from 'react-native';
import { UnistylesTheme } from 'react-native-unistyles';

import { ILayoutProvider } from './modal-window.component';

type ITimingAnimationConfig = Omit<Animated.TimingAnimationConfig, 'toValue'>;

export type IModalWindowLayoutConfig = ITimingAnimationConfig & {
};

const DEFAULT_CONFIG: IModalWindowLayoutConfig = {
  useNativeDriver: true,
  duration: 300,
};

export class AnimatedBackgroundLayoutProvider implements ILayoutProvider {

  private animation = new Animated.Value(0);

  constructor(private config: IModalWindowLayoutConfig = DEFAULT_CONFIG) {}

  public getWrapperComponent(theme: UnistylesTheme): React.FC<ViewProps> {
    return (props: ViewProps): React.ReactElement => (
      <Animated.View
        {...props}
        style={[props.style, this.getAnimationStyle(theme.colors.overlay)]}
      />
    );
  }

  public onWindowSizeChange(numberOfActiveModals: number): Promise<void> {
    return new Promise(resolve => {
      const toValue: number = numberOfActiveModals > 0 ? 1 : 0;
      Animated.timing(this.animation, { ...this.config, toValue })
        .start(() => resolve());
    });
  }

  private getAnimationStyle(overlayColor: string): ViewStyle {
    return {
      backgroundColor: this.animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', overlayColor],
      }) as any,
    };
  }
}
