import { IUserService } from '.';
import { IUserDatasource, UserService } from './user.service';

jest.unmock('./user.service');

describe('UserService', () => {

  let userService: IUserService;

  beforeEach(() => {
    const api: IUserDatasource = {
      getUser: jest.fn(() => Promise.resolve({ id: '1', name: 'John Doe' })),
    };

    userService = new UserService(api);
  });

  it('should throw getUser when not initialized', () => {
    expect(() => userService.getUser())
      .toThrow(/User not found/);
  });

  it('should get user when initialized', async () => {
    await (userService as UserService).initialize({ userId: '1', secret: '123' });

    expect(userService.getUser())
      .toEqual({ id: '1', name: 'John Doe' });
  });
});
