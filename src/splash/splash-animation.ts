import { Animated, ImageStyle } from 'react-native';

import { ISplashAnimation } from './splash.vm';

export interface IAnimationConfig {
  duration?: number;
  /**
   * [start, mid, end]
   */
  opacity?: [number, number, number];
  scale?: [number, number, number];
}

const defaultConfig: IAnimationConfig = {
  duration: 500,
  opacity: [0, 1, 1],
  scale: [0, 1, 500],
};

export class SplashAnimation implements ISplashAnimation {

  private static PHASE_START: number = -1;
  private static PHASE_MID: number = 0;
  private static PHASE_END: number = 1;

  private animation: Animated.Value;
  private config: IAnimationConfig;

  constructor(config: IAnimationConfig = defaultConfig) {
    this.animation = new Animated.Value(SplashAnimation.PHASE_START);
    this.config = { ...defaultConfig, ...config };
  }

  public playTillIntermediate(): Promise<void> {
    return this.runAnimation(SplashAnimation.PHASE_MID)
      .then(() => this.runAnimation(SplashAnimation.PHASE_MID - 0.2));
  }

  public finish(): Promise<void> {
    return this.runAnimation(SplashAnimation.PHASE_END);
  }

  public getImageStyle(): ImageStyle {
    return {
      opacity: this.animation.interpolate({
        inputRange: [SplashAnimation.PHASE_START, SplashAnimation.PHASE_MID, SplashAnimation.PHASE_END],
        outputRange: this.config.opacity,
        extrapolate: 'clamp',
      }),
      transform: [
        {
          scale: this.animation.interpolate({
            inputRange: [SplashAnimation.PHASE_START, SplashAnimation.PHASE_MID, SplashAnimation.PHASE_END],
            outputRange: this.config.scale,
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  }

  private runAnimation(toValue: number): Promise<void> {
    return new Promise(resolve => {
      Animated
        .timing(this.animation, { duration: this.config.duration, toValue, useNativeDriver: true })
        .start(() => resolve());
    });
  }
}
