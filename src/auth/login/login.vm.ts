import { ISessionService } from '@/auth/session';
import { IRouter } from '@/router';

import { ILoginFormValues } from './components/login-form.component';
import { ILoginVM } from './login.component';

export class LoginVM implements ILoginVM {

  public readonly title = 'Login';

  public readonly initialValues: ILoginFormValues = {
    email: 'test@test.com',
    password: 'password',
  };

  constructor(private router: IRouter, private sessionService: ISessionService) {
  }

  public submit = async (values: ILoginFormValues): Promise<void> => {
    try {
      await this.sessionService.login(values.email, values.password);
      this.router.replace('/home');
    } catch {
      // no-op
    }
  };

  public goBack = (): void => {
    this.router.goBack();
  };
}
