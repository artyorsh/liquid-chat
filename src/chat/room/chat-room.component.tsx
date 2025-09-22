import { View } from 'react-native';
import { observer } from 'mobx-react';
import { GiftedChat, IMessage as GiftedChatMessage, MessageProps } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native-unistyles';
import { ImageBackground } from 'expo-image';
import { toJS } from 'mobx';

import { ChatMessage } from './components/chat-message.component';
import { NavigationBar } from './components/navigation-bar.component';
import { TypingIndicator } from './components/typing-indicator.component';

export interface IChatRoomVM {
  topic: string;
  isTyping: boolean;
  messages: GiftedChatMessage[];
  goBack(): void;
}

export const ChatRoom: React.FC<{ vm: IChatRoomVM }> = observer(({ vm }) => {

  const renderMessage = (props: MessageProps<GiftedChatMessage>): React.ReactElement => (
    <ChatMessage
      style={styles.message}
      message={props.currentMessage}
    />
  );

  const renderTypingIndicator = (): React.ReactElement => (
    <TypingIndicator
      style={styles.typingIndicator}
      isTyping={vm.isTyping}
    />
  );

  return (
    <ImageBackground
      style={styles.container}
      source={require('../background.jpg')}>
      <NavigationBar
        title={vm.topic}
        onBackPress={vm.goBack}
      />
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={toJS(vm.messages)}
          isTyping={vm.isTyping}
          renderUsernameOnMessage={true}
          disableComposer={true}
          renderMessage={renderMessage}
          renderComposer={() => <View />}
          renderTypingIndicator={renderTypingIndicator}
          user={{
            _id: 2,
          }}
        />
      </View>
    </ImageBackground>
  );
});

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
    paddingTop: runtime.insets.top,
  },
  chatContainer: {
    flex: 1,
    paddingBottom: runtime.insets.bottom,
  },
  message: {
    marginVertical: theme.gap(2),
    marginHorizontal: theme.gap(3),
  },
  typingIndicator: {
    marginHorizontal: theme.gap(3),
    marginBottom: runtime.insets.bottom,
  },
}));
