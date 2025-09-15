import { ISession } from '@/auth/session';
import { ISessionModule } from '@/auth/session/initialzier';
import { ILogService } from '@/log';

import { IUser, IUserService } from '.';

export interface IUserRepository {
  getUser(userId: string): Promise<IUser>;
}

export class UserService implements IUserService, ISessionModule {

  public readonly moduleIdentifier: string = UserService.name;

  private user: IUser | null = null;

  constructor(private userRepository: IUserRepository, private logger: ILogService) {}

  public getUser = (): IUser => {
    if (!this.user) {
      throw new Error('User not found. Was the session initialized?');
    }

    return this.user;
  };

  public initialize = (session: ISession): Promise<void> => {
    return this.userRepository.getUser(session.userId).then(user => {
      this.user = user;
      this.logger.addLabel('user_id', user.id);
    });
  };

  public destroy = (): Promise<void> => {
    this.user = null;

    return Promise.resolve();
  };
}
