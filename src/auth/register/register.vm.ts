import { ISessionService } from '@/auth/session';
import { IRouter } from '@/router';

import { IRegisterFormValues } from './components/register-form.component';
import { IRegisterVM } from './register.component';

export class RegisterVM implements IRegisterVM {

  public readonly title = 'Register';

  constructor(private router: IRouter, private sessionService: ISessionService) {
  }

  public submit = async (values: IRegisterFormValues): Promise<void> => {
    try {
      await this.sessionService.register(values.name, values.email, values.password);
      this.router.replace('/home');
    } catch {
      // no-op
    }
  };

  public goBack = (): void => {
    this.router.goBack();
  };
}
