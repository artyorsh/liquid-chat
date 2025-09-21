import { fireEvent, render } from '@testing-library/react-native';

import { IWelcomeVM, Welcome } from './welcome.component';

describe('Welcome Component', () => {

  let vm: IWelcomeVM;

  beforeEach(() => {
    vm = {
      title: 'Welcome',
      login: jest.fn(),
      register: jest.fn(),
    };
  });

  it('should call login when login button is pressed', () => {
    const api = render(<Welcome vm={vm} />);

    fireEvent.press(api.getByTestId('login-button'));

    expect(vm.login).toHaveBeenCalled();
  });

  it('should call register when register button is pressed', () => {
    const api = render(<Welcome vm={vm} />);

    fireEvent.press(api.getByTestId('register-button'));
    expect(vm.register).toHaveBeenCalled();
  });

});
