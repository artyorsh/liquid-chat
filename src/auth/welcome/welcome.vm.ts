import { IRouter } from '@/router';

import { IWelcomeVM } from './welcome.component';

export class WelcomeVM implements IWelcomeVM {

  public readonly title = 'Welcome';

  constructor(private router: IRouter) {
  }

  public login = (): void => {
    this.router.navigate('/auth/login');
  };

  public register = (): void => {
    this.router.navigate('/auth/register');
  };
}
