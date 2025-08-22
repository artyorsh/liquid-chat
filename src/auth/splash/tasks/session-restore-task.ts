import { ISessionService } from '@/auth/session';

import { ISplashScreenTask } from '../splash.vm';

export class SessionRestoreTask implements ISplashScreenTask {

  constructor(private session: ISessionService) {}

  public run(): Promise<void> {
    return this.session.restore()
      .then();
  }
}
