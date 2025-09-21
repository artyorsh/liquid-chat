import { forwardRef, useEffect, useImperativeHandle } from 'react';
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

export const Modal = forwardRef<IModalRef, ModalProps>(({ layoutProvider, onRequestClose, ...props }, ref) => {

  const WrapperComponent = layoutProvider.getWrapperComponent();

  useImperativeHandle(ref, () => ({
    show: () => layoutProvider.setVisible(true),
    hide: () => layoutProvider.setVisible(false),
  }));

  useEffect(() => {
    layoutProvider.setVisible(true);

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onRequestClose?.();

      return !!onRequestClose;
    });

    return () => subscription.remove();
  }, [layoutProvider, onRequestClose]);

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
