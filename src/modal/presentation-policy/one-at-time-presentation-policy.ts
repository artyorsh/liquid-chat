import { IWindowSizeListener } from '..';
import { IModalPresentationPolicy } from '../modal.service';

interface IOneAtTimePresentationPolicyOptions {
  nextPresentationDelay: number;
}

const defaultOptions: IOneAtTimePresentationPolicyOptions = {
  nextPresentationDelay: 0,
};

export class OneAtTimePresentationPolicy implements IModalPresentationPolicy {

  constructor(private options: IOneAtTimePresentationPolicyOptions = defaultOptions) {

  }

  public apply(numberOfActiveModals: number, subscribe: (listener: IWindowSizeListener) => Function): Promise<void> {
    if (numberOfActiveModals === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve, _reject) => {
      const subcriptionRemover = subscribe({
        onWindowSizeChange: (nextNumberOfActiveModals: number) => {
          if (nextNumberOfActiveModals === 0) {
            subcriptionRemover();

            return this.waitForNextPresentation(this.options.nextPresentationDelay).then(resolve);
          }
        },
      });
    });
  }

  private waitForNextPresentation = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
}
