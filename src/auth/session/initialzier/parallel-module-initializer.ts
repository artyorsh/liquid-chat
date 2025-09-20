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

  public async initialize(session: ISession): Promise<void> {
    const initializerPromizes = this.modules.map(module => this.initializeModule(module, session));

    try {
      await Promise.all(initializerPromizes);
    } catch (error) {
      this.logSessionInitFailure(error);

      throw error;
    }
  }

  public async destroy(): Promise<void> {
    const destroyerPromises = this.modules.map(initializer => initializer.destroy());

    try {
      await Promise.all(destroyerPromises || []);
    } catch (error) {
      this.logger.error(`Failed to destroy modules: ${error.message}`);
    }
  }

  private async initializeModule(module: ISessionModule, session: ISession): Promise<void> {
    try {
      await module.initialize(session);
      this.logModuleInitSuccess(module);
    } catch (error) {
      const shouldFailSessionInit: boolean = this.options.shouldFailOnModuleFailure(module, error);

      if (shouldFailSessionInit) {
        this.logModuleInitFailure(module, error);

        throw error;
      }

      this.logModuleInitFailureIgnored(module, error);
    }
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
