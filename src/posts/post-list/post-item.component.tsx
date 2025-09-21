import { StyleSheet, View, ViewProps } from 'react-native';

import { Card } from '@/uilib/card.component';
import { Image } from '@/uilib/image.component';
import { Text } from '@/uilib/text.component';

import { IPost } from '..';

interface Props extends ViewProps {
  vm: IPostVM;
}

export interface IPostVM {
  post: IPost;
  viewDetails(): void;
}

export const PostItem: React.FC<Props> = ({ vm, ...props }) => {
  return (
    <Card
      {...props}
      onPress={() => vm.viewDetails()}>
      <Image
        style={styles.image}
        source={{ uri: vm.post.image_url }}
      />
      <View style={styles.content}>
        <Text category='heading'>
          {vm.post.title}
        </Text>
        <Text category='paragraph'>
          {vm.post.body}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 192,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
