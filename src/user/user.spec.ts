import { ILogService } from '@/log';

import { IUserService } from '.';
import { IUserDatasource, UserService } from './user.service';

jest.unmock('./user.service');

describe('UserService', () => {

  let userService: IUserService;
  let logService: ILogService;

  beforeEach(() => {
    const api: IUserDatasource = {
      getUser: jest.fn(() => Promise.resolve({ id: '1', name: 'John Doe' })),
    };

    logService = jest.requireMock('../log/log.service').LogService();

    userService = new UserService(api, logService);
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

  it('should add user id to log labels when initialized', async () => {
    await (userService as UserService).initialize({ userId: '1', secret: '123' });

    expect(logService.addLabel).toHaveBeenCalledWith('user_id', '1');
  });
});
