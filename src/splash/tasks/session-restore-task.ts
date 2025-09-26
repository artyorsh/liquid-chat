import { ISessionService } from '@/auth/session';
import { II18nService } from '@/i18n';
import { IRoute } from '@/router';

import { ISplashScreenTask } from '../splash.vm';

export class SessionRestoreTask implements ISplashScreenTask {

  constructor(private session: ISessionService, private i18nService: II18nService) {}

  public async run(): Promise<[IRoute, object]> {
    try {
      await this.i18nService.configure();
      await this.session.restore();

      return ['/home', {}];
    } catch {
      return ['/auth', {}];
    }
  }
}
