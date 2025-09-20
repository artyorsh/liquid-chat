import { ResolutionContext } from "inversify";

import { ILogTransporter } from "../log.service";
import { FileLogTransporter } from "./file-log-transporter";

export const createFileTransport = (_context: ResolutionContext): ILogTransporter => {
  const fileName: string = process.env.EXPO_PUBLIC_LOG_FILE_NAME;

  return new FileLogTransporter(fileName);
};
