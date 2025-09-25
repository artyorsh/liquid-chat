import { ISession } from '@/auth/session';
import { ISessionModule } from '@/auth/session/initialzier';

import { IUser, IUserService } from '.';

export interface IUserDatasource {
  getUser(secret: string): Promise<IUser>;
}

export class UserService implements IUserService, ISessionModule {

  public readonly moduleIdentifier: string = UserService.name;

  private user: IUser | null = null;

  constructor(private dataSource: IUserDatasource) {}

  public getUser(): IUser {
    if (!this.user) {
      throw new Error('User not found. Was the session initialized?');
    }

    return this.user;
  }

  public async initialize(session: ISession): Promise<void> {
    const user = await this.dataSource.getUser(session.secret);
    this.user = user;
  };

  public async destroy(): Promise<void> {
    this.user = null;

    return Promise.resolve();
  };
}
