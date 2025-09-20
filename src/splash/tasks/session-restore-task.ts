import { ISessionService } from '@/auth/session';

import { ISplashScreenTask } from '../splash.vm';

export class SessionRestoreTask implements ISplashScreenTask {

  constructor(private session: ISessionService) {}

  public async run(): Promise<void> {
    await this.session.restore();
  }
}
