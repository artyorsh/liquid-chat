import { ResolutionContext } from "inversify";

import { ILogTransporter } from "../log.service";
import { GrafanaLogTransporter } from "./grafana-log-transporter";

export const createGrafanaTransport = (_context: ResolutionContext): ILogTransporter => {
  const hostUrl: string = process.env.EXPO_PUBLIC_LOG_GRAFANA_HOST;

  return new GrafanaLogTransporter({ hostUrl });
};
