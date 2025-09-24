import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { ISessionService } from '@/auth/session';
import { IRouter } from '@/router';

import { IRegisterVM, Register } from './register.component';
import { RegisterVM } from './register.vm';

describe('Register Component', () => {

  let vm: IRegisterVM;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    vm = {
      title: 'Register Title',
      submit: jest.fn(),
      goBack: jest.fn(),
    };
  });

  it('should render without initial values', () => {
    const api = render(<Register vm={vm} />);

    expect(api.getByTestId('name-input').props.value).toBe('');
    expect(api.getByTestId('email-input').props.value).toBe('');
    expect(api.getByTestId('password-input').props.value).toBe('');
  });

  it('should call submit with correct values', () => {
    const api = render(<Register vm={vm} />);

    fireEvent.changeText(api.getByTestId('name-input'), 'user');
    fireEvent.changeText(api.getByTestId('email-input'), 'test2@test.com');
    fireEvent.changeText(api.getByTestId('password-input'), 'password2');

    fireEvent.press(api.getByTestId('submit-button'));

    expect(vm.submit).toHaveBeenCalledWith({ name: 'user', email: 'test2@test.com', password: 'password2' });
  });
});

describe('Register VM', () => {
  let router: IRouter;
  let sessionService: ISessionService;

  beforeEach(() => {
    router = jest.requireMock('@/router/react-navigation/react-navigation-router').RouterService();
    sessionService = jest.requireMock('@/auth/session/session.service').SessionService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to home screen if registration is successful', async () => {
    const vm: IRegisterVM = new RegisterVM(router, sessionService);

    vm.submit({ name: 'User', email: 'test@test.com', password: 'password' });

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('should not navigate if registration is unsuccessful', async () => {
    sessionService.register = jest.fn(() => Promise.reject());
    const vm: IRegisterVM = new RegisterVM(router, sessionService);

    vm.submit({ name: 'User', email: 'test@test.com', password: 'password' });

    await waitFor(() => {
      expect(router.replace).not.toHaveBeenCalled();
    });
  });
});
