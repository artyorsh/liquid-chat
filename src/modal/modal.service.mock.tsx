jest.mock('./modal.service', () => ({
  ModalService: jest.fn().mockImplementation(() => {
    const View = jest.requireActual('react-native').View;

    return {
      getWindow: () => <View testID='@modal/window' />,
      show: jest.fn(() => Promise.resolve({})),
      subscribe: jest.fn(() => () => { /* no-op */}),
    };
  }),
}));

