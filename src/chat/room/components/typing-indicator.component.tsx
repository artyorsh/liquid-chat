// Copy-paste from react-native-gifted-chat, replacing styles with react-native-unistyles and expo-glass-effect
// @see https://github.com/FaridSafi/react-native-gifted-chat/blob/2.8.1/src/TypingIndicator/index.tsx

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { GlassView } from 'expo-glass-effect';

interface Props extends ViewProps {
  isTyping: boolean;
}

const DotsAnimation: React.FC = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  const topY = useMemo(() => -5, []);
  const bottomY = useMemo(() => 5, []);
  const duration = useMemo(() => 500, []);

  const dot1Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: dot1.value,
      },
    ],
  }), [dot1]);

  const dot2Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: dot2.value,
      },
    ],
  }), [dot2]);

  const dot3Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: dot3.value,
      },
    ],
  }), [dot3]);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(topY, { duration }),
        withTiming(bottomY, { duration }),
      ),
      0,
      true,
    );
  }, [dot1, topY, bottomY, duration]);

  useEffect(() => {
    dot2.value = withDelay(
      100,
      withRepeat(
        withSequence(
          withTiming(topY, { duration }),
          withTiming(bottomY, { duration }),
        ),
        0,
        true,
      ),
    );
  }, [dot2, topY, bottomY, duration]);

  useEffect(() => {
    dot3.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(topY, { duration }),
          withTiming(bottomY, { duration }),
        ),
        0,
        true,
      ),
    );
  }, [dot3, topY, bottomY, duration]);

  return (
    <GlassView
      style={styles.dots}
      glassEffectStyle='clear'>
      <Animated.View style={[styles.dot, dot1Style]} />
      <Animated.View style={[styles.dot, dot2Style]} />
      <Animated.View style={[styles.dot, dot3Style]} />
    </GlassView>
  );
};

export const TypingIndicator: React.FC<Props> = ({ isTyping, ...props }) => {
  const yCoords = useSharedValue(200);
  const heightScale = useSharedValue(0);
  const marginScale = useSharedValue(0);

  const [isVisible, setIsVisible] = useState(isTyping);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: yCoords.value,
      },
    ],
    height: heightScale.value,
    marginBottom: marginScale.value,
  }), [yCoords, heightScale, marginScale]);

  const slideIn = useCallback(() => {
    const duration = 250;

    yCoords.value = withTiming(0, { duration });
    heightScale.value = withTiming(35, { duration });
    marginScale.value = withTiming(8, { duration });
  }, [yCoords, heightScale, marginScale]);

  const slideOut = useCallback(() => {
    const duration = 250;

    yCoords.value = withTiming(200, { duration }, isFinished => {
      if (isFinished) {
        runOnJS(setIsVisible)(false);
      }
    });
    heightScale.value = withTiming(0, { duration });
    marginScale.value = withTiming(0, { duration });
  }, [yCoords, heightScale, marginScale]);

  useEffect(() => {
    if (isVisible) {
      if (isTyping) {
        slideIn();
      } else {
        slideOut();
      }
    }
  }, [isVisible, isTyping, slideIn, slideOut]);

  useEffect(() => {
    if (isTyping) {
      setIsVisible(true);
    }
  }, [isTyping]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      {...props}
      style={[styles.container, props.style, containerStyle]}>
      <DotsAnimation />
    </Animated.View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius,
  },
  dots: {
    flexDirection: 'row',
    padding: theme.gap(3),
    borderRadius: theme.radius,
    gap: theme.gap(1),
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.onBackground,
  },
}));
