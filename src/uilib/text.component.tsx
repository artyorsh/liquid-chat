import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export interface TextProps extends RNTextProps {
  type?: TextType;
  category?: TextCategory;
}

export type TextType =
  | 'hint';

type TextCategory =
  | 'heading'
  | 'subheading'
  | 'paragraph';

export const Text: React.FC<TextProps> = ({ children, type, category = 'paragraph', ...props }) => {
  styles.useVariants({ type, category });

  return (
    <RNText
      {...props}
      style={[styles.text, props.style]}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  text: {
    color: theme.colors.onBackground,
    variants: {
      type: {
        hint: {
          color: theme.colors.hint,
        },
      },
      category: {
        heading: theme.typography.heading(rt.fontScale),
        subheading: theme.typography.subheading(rt.fontScale),
        paragraph: theme.typography.paragraph(rt.fontScale),
      },
    },
  },
}));
