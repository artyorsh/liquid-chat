import { IUser } from '..';
import { IUserDatasource } from '../user.service';

export class MockUserDatasource implements IUserDatasource {

  public getUser(_secret: string): Promise<IUser> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: 'John Doe',
        });
      }, 500);
    });
  }
}
