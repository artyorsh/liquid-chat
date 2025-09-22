import { IMLCResponseParser } from './mlc-provider';

export class MLCResponseParser implements IMLCResponseParser {

  public parse(response: string): object {
    if (response.startsWith('```')) {
      // Some models insistently wrap JSON content into ``` blocks.
      response = this.removeBackticks(response);
    }

    return JSON.parse(response);
  }

  private removeBackticks(response: string): string {
    const firstFenceEnd: number = response.indexOf('\n');
    response = firstFenceEnd !== -1 ? response.slice(firstFenceEnd + 1) : response.replace(/^```[^\n]*/, '');

    const closingIndex: number = response.lastIndexOf('```');
    if (closingIndex !== -1) {
      response = response.slice(0, closingIndex);
    }

    return response;
  }
}
