import { ISessionService } from '@/auth/session';
import { IRoute } from '@/router';

import { ISplashScreenTask } from '../splash.vm';

export class SessionRestoreTask implements ISplashScreenTask {

  constructor(private session: ISessionService) {}

  public async run(): Promise<[IRoute, object]> {
    try {
      await this.session.restore();

      return ['/home', {}];
    } catch {
      return ['/auth', {}];
    }
  }
}
