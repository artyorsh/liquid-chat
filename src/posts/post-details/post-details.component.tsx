import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/uilib/button.component';
import { IconButton } from '@/uilib/icon-button.component';
import { Text } from '@/uilib/text.component';

import { IPost } from '..';

interface Props {
  post: IPost;
  markHidden(): void;
  close(): void;
}

export const PostDetails: React.FC<Props> = ({ post, markHidden, close: onRequestClose }) => (
  <View style={styles.container}>
    <IconButton
      style={styles.closeButton}
      icon='Close'
      onPress={() => onRequestClose()}
    />
    <Text category='heading'>
      {post.title}
    </Text>
    <Text style={styles.body}>
      {post.body}
    </Text>
    <Button
      style={styles.removeButton}
      type='tertiary'
      title='Remove from Feed'
      onPress={() => markHidden()}
    />
  </View>
);

const styles = StyleSheet.create(theme => ({
  container: {
    padding: theme.gap(8),
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.outline,
    borderTopWidth: 1,
  },
  closeButton: {
    position: 'absolute',
    top: theme.gap(3),
    right: theme.gap(3),
  },
  body: {
    marginTop: theme.gap(3),
  },
  removeButton: {
    marginTop: theme.gap(10),
  },
}));
