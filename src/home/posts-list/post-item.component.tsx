import React from 'react';
import { ImageSourcePropType, StyleSheet, View, ViewProps } from 'react-native';

import { Card } from '@/uilib/card.component';
import { Image } from '@/uilib/image.component';
import { Text } from '@/uilib/text.component';

interface Props extends ViewProps {
  vm: IPostVM;
}

export interface IPostVM {
  title: string;
  body: string;
  image: ImageSourcePropType;
  viewDetails(): void;
}

export const PostItem: React.FC<Props> = ({ vm, ...props }) => {
  return (
    <Card
      {...props}
      onPress={() => vm.viewDetails()}>
      <Image
        style={styles.image}
        source={vm.image}
      />
      <View style={styles.content}>
        <Text category='heading'>
          {vm.title}
        </Text>
        <Text category='paragraph'>
          {vm.body}
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
