import { IUser } from '.';
import { IUserRepository } from './user.service';

export class UserApi implements IUserRepository {

  public getUser = (userId: string): Promise<IUser> => {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve({
          id: userId,
          name: 'John Doe',
        });
      }, 500);
    });
  };
}
