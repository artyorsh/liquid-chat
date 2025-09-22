import { View, ViewProps } from 'react-native';
import { IMessage } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native-unistyles';
import { GlassView } from 'expo-glass-effect';

import { Card } from '@/uilib/card.component';
import { Text } from '@/uilib/text.component';

interface Props extends ViewProps {
  message: IMessage;
}

export const ChatMessage: React.FC<Props> = ({ message, ...props }) => {

  const displayName: string = message.user.name.slice(0, 1).toUpperCase();

  return (
    <View
      {...props}
      style={[styles.container, props.style]}>
      <GlassView
        style={styles.userName}
        glassEffectStyle='clear'>
        <Text>
          {displayName}
        </Text>
      </GlassView>
      <Card style={styles.messageContainer}>
        <Text>
          {message.text}
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flexDirection: 'row',
  },
  messageContainer: {
    marginHorizontal: theme.gap(3),
    paddingVertical: theme.gap(3),
    paddingHorizontal: theme.gap(4),
    maxWidth: rt.screen.width * 0.75,
  },
  userName: {
    height: 32,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
}));
