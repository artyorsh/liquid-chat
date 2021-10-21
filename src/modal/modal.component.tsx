import React from 'react';
import { BackHandler, StyleSheet, ViewProps } from 'react-native';

export interface ILayoutProvider {
  getWrapperComponent(): React.FC<ViewProps>;
  setVisible(visible: boolean): Promise<void>;
}

export interface ModalProps extends ViewProps {
  layoutProvider: ILayoutProvider;
  onRequestClose?(): void;
}

export interface IModalRef {
  show(): Promise<void>;
  hide(): Promise<void>;
}

export const Modal = React.forwardRef<IModalRef, ModalProps>(({ layoutProvider, ...props }, ref) => {

  const WrapperComponent = layoutProvider.getWrapperComponent();

  React.useImperativeHandle(ref, () => ({
    show: () => layoutProvider.setVisible(true),
    hide: () => layoutProvider.setVisible(false),
  }));

  React.useEffect(() => {
    layoutProvider.setVisible(true);

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      props.onRequestClose?.();

      return !!props.onRequestClose;
    });

    return () => subscription.remove();
  }, []);

  return (
    <WrapperComponent style={[styles.container, props.style]}>
      {props.children}
    </WrapperComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
