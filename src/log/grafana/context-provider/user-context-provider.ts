import { IUserService } from '@/user';

import { IGrafanaLogContext, IGrafanaLogContextProvider } from '../grafana-log-transporter';

export class UserContextProvider implements IGrafanaLogContextProvider {
  constructor(private userService: IUserService) {

  }

  public getContext(): IGrafanaLogContext {
    try {
      const user = this.userService.getUser();

      return { user_id: user.id };
    } catch {
      return {};
    }
  }
}
