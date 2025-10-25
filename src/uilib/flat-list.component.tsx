import { FC } from 'react';
import { FlatList as RNFlatList, FlatListProps } from 'react-native';

export interface IFlatListProps<T = any> extends FlatListProps<T> {
  /**
   * Creates performance optimization props based on the defined number.
   * @see https://reactnative.dev/docs/optimizing-flatlist-configuration
   *
   * This can be float to better handle partially visible items.
   * Default: 10 (aligned with the default initialNumToRender), which translates to:
   * ```
   * {
   *   initialNumToRender: 20  // Two viewports for the initial render.
   *   maxToRenderPerBatch: 20 // Three viewports per scroll event: current + 0.5 top + 0.5 bottom (or current + 1 of either directions)
   *   windowSize: 3.          // Three viewports per scroll event. Means there will be 2 * numItemsInViewPort on the initial render.
   * }
   * ```
   *
   * @example using with react-native-unistyles
   * ```
   * import { UnistylesBreakpoints, UnistylesRuntime } from 'react-native-unistyles';
   *
   * const NUM_ITEMS_IN_VIEWPORT: Partial<Record<keyof UnistylesBreakpoints, number>> = {
   *   xs: 1.5,
   *   sm: 1.7,
   *   md: 2.3,
   *   lg: 2.5,
   * };
   *
   * const numItemsInViewPort: number = NUM_ITEMS_IN_VIEWPORT[UnistylesRuntime.breakpoint];
   *
   * <FlatList {...props} numItemsInViewPort />
   * ```
   *
   * Always check for optimal values with Profiler.
   */
  numItemsInViewPort?: number;
  estimatedItemSize?: number;
}

const createFlatListPerformanceProps = (numItemsInViewPort: number, estimatedItemSize?: number): Partial<FlatListProps<any>> => {
  const props: Partial<FlatListProps<any>> = {
    initialNumToRender: Math.ceil(numItemsInViewPort * 2),
    maxToRenderPerBatch: Math.ceil(numItemsInViewPort * 2),
    windowSize: 3,
  };

  if (!!estimatedItemSize) {
    props.getItemLayout = (_data: any[], index: number): { length: number; offset: number; index: number } => ({
      length: estimatedItemSize,
      offset: index * estimatedItemSize,
      index,
    });
  }

  return props;
};

export const FlatList: FC<IFlatListProps> = ({ numItemsInViewPort = 10, estimatedItemSize, ...props }) => {
  return (
    <RNFlatList
      {...createFlatListPerformanceProps(numItemsInViewPort, estimatedItemSize)}
      {...props}
    />
  );
};
