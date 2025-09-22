import { Pressable, View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { GlassStyle, GlassView } from 'expo-glass-effect';

import { Icons } from '@/uilib/icon.component';
import { Text } from '@/uilib/text.component';

interface Props extends ViewProps {
  title: string;
  onBackPress(): void;
}

const GLASS_EFFECT_STYLE: GlassStyle = 'clear';

export const NavigationBar: React.FC<Props> = ({ title, onBackPress, ...props }) => (
  <View
    {...props}
    style={[styles.container, props.style, styles.containerBase]}>
    <GlassView
      style={styles.backButton}
      glassEffectStyle={GLASS_EFFECT_STYLE}>
      <Pressable onPress={onBackPress}>
        <Icons.Back style={styles.backIcon} />
      </Pressable>
    </GlassView>
    <GlassView
      style={styles.titleContainer}
      glassEffectStyle={GLASS_EFFECT_STYLE}>
      <Text
        style={styles.title}
        category='subheading'>
        {title}
      </Text>
    </GlassView>
  </View>
);

const styles = StyleSheet.create((theme, runtime) => ({
  containerBase: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: runtime.insets.top,
    zIndex: 10,
  },
  container: {
    padding: theme.gap(3),
  },
  titleContainer: {
    flex: 1,
    borderRadius: 100,
    marginHorizontal: theme.gap(2),
    paddingVertical: theme.gap(3),
    paddingHorizontal: theme.gap(6),
  },
  title: {
    textAlign: 'center',
  },
  backButton: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.gap(2),
    borderRadius: 100,
  },
  backIcon: {
    fontSize: 16,
    color: theme.colors.onBackground,
  },
}));
