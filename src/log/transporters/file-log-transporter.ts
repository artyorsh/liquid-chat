import { File, Paths } from 'expo-file-system';

import { ILogTransporter, ITransporterLogPayload } from '../log.service';

interface ILogMessage {
  timestamp: number;
  message: string;
  payload: Record<string, string>;
}

export class FileLogTransporter implements ILogTransporter {

  public readonly id: string = '@log/file';

  private logFile: File;
  private writer: WritableStreamDefaultWriter;
  private encoder: TextEncoder = new TextEncoder();

  constructor(filename: string) {
    this.logFile = new File(Paths.document, filename);
    this.logFile.create({ overwrite: true });

    this.writer = this.logFile.writableStream().getWriter();
  }

  public transport = (tag: string, message: string, payload: ITransporterLogPayload): void => {
    const logMessage: ILogMessage = this.createLogMessage(tag, message, payload);

    this.writeToFile(logMessage);
  };

  public flush = async (): Promise<void> => {
    this.writer.close().then(() => {
      this.writer = this.logFile.writableStream().getWriter();
    });
  };

  private createLogMessage = (tag: string, message: string, payload: ITransporterLogPayload): ILogMessage => {
    return {
      timestamp: Date.now(),
      message: `${tag}: ${message}`,
      payload: payload,
    };
  };

  private writeToFile = (message: ILogMessage): Promise<void> => {
    const jsonStringMessage: string = JSON.stringify(message);
    const encodedMessage: Uint8Array = this.encoder.encode(`${jsonStringMessage}\n`);

    return this.writer.write(encodedMessage);
  };
}
