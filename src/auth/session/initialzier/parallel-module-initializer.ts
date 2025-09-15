import { ILogger } from '@/log';

import { ISession } from '..';
import { ISessionInitializer } from '../session.service';
import { ISessionModule } from '.';

export interface IParallelModuleInitializerOptions {
  shouldFailOnModuleFailure(module: ISessionModule, error: Error): boolean;
}

export class ParallelModuleInitializer implements ISessionInitializer {

  constructor(
    private modules: ISessionModule[],
    private logger: ILogger,
    private options: IParallelModuleInitializerOptions,
  ) {

  }

  public initialize(session: ISession): Promise<void> {
    const initializerPromizes = this.modules.map(module => {
      return module.initialize(session).then(() => {
        this.logModuleInitSuccess(module);
      }).catch(error => {
        const shouldFailSessionInit: boolean = this.options.shouldFailOnModuleFailure(module, error);

        if (shouldFailSessionInit) {
          this.logModuleInitFailure(module, error);

          throw error;
        }

        this.logModuleInitFailureIgnored(module, error);
      });
    });

    return Promise.all(initializerPromizes)
      .then(() => {/** no-op */})
      .catch(error => {
        this.logSessionInitFailure(error);

        throw error;
      });
  }

  public destroy(): Promise<void> {
    const destroyerPromises = this.modules.map(initializer => initializer.destroy());

    return Promise.all(destroyerPromises || [])
      .then(() => {/** no-op */})
      .catch(error => {
        this.logger.error(`Failed to destroy modules: ${error.message}`);
      });
  }

  private logModuleInitSuccess(module: ISessionModule): void {
    this.logger.debug(`Initialized ${module.moduleIdentifier}`);
  }

  private logModuleInitFailure(module: ISessionModule, error: Error): void {
    this.logger.error(`Failed to initialize ${module.moduleIdentifier}, failing session init. Error: ${error.message}`);
  }

  private logModuleInitFailureIgnored(module: ISessionModule, error: Error): void {
    this.logger.warn(`Failed to initialize ${module.moduleIdentifier}, ignoring. Error: ${error.message}`);
  }

  private logSessionInitFailure(error: Error): void {
    this.logger.error(`Failed to initialize modules: ${error.message}`);
  }
}
