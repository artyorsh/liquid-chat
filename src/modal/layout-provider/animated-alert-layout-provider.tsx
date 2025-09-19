import { Animated } from 'react-native';

type ITimingAnimationConfig = Omit<Animated.TimingAnimationConfig, 'toValue'>;

export type IAlertLayoutProviderOptions = ITimingAnimationConfig & {
};

export const DEFAULT_OPTIONS: IAlertLayoutProviderOptions = {
  useNativeDriver: true,
  duration: 300,
};
