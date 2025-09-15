import React, { useState } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { UnistylesTheme, useUnistyles } from 'react-native-unistyles';

export interface IModalWindowRef {
  mount(element: React.ReactElement): number;
  unmount(id: number): void;
}

type IElementMap = Map<number, React.ReactElement>;

export interface ILayoutProvider {
  getWrapperComponent(theme: UnistylesTheme): React.FC<ViewProps>;
  onWindowSizeChange(numberOfActiveModals: number): Promise<void>;
}

interface Props extends ViewProps {
  layoutProvider: ILayoutProvider;
  onWindowSizeChange(numberOfActiveModals: number): void;
}

export const ModalWindow = React.forwardRef<IModalWindowRef, Props>(({ layoutProvider, ...props }, ref) => {

  const { theme } = useUnistyles();
  const [elements, setElements] = useState<IElementMap>(new Map());

  const WrapperComponent = layoutProvider.getWrapperComponent(theme);

  React.useEffect(() => {
    layoutProvider.onWindowSizeChange(elements.size);
    props.onWindowSizeChange(elements.size);
  }, [elements.size]);

  React.useImperativeHandle(ref, () => ({
    mount(element: React.ReactElement): number {
      elements.set(elements.size, element);
      setElements(new Map(elements));

      return elements.size - 1;
    },
    unmount(id: number): void {
      elements.delete(id);
      setElements(new Map(elements));
    },
  }));

  const renderElement = ([id, element]: [number, React.ReactElement]): React.ReactElement => {
    return React.cloneElement(element, { key: id });
  };

  return (
    <WrapperComponent
      {...props}
      pointerEvents='box-none'
      style={[StyleSheet.absoluteFill, props.style]}>
      {Array.from(elements.entries()).map(renderElement)}
    </WrapperComponent>
  );
});
