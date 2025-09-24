import { IHttpClient } from "@/http";

import { IUser } from "..";
import { IUserDatasource } from "../user.service";

export class RemoteUserDatasource implements IUserDatasource {
  constructor(private httpClient: IHttpClient) {

  }

  public async getUser(secret: string): Promise<IUser> {
    return this.httpClient.get(`/auth/user`, {
      headers: {
        'Authorization': `Bearer ${secret}`,
      },
    });
  }
}
