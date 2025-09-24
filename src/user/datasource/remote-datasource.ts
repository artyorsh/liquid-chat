import { IHttpClient } from "@/http";

import { IUser } from "..";
import { IUserDatasource } from "../user.service";

export class RemoteUserDatasource implements IUserDatasource {
  constructor(private httpClient: IHttpClient) {

  }

  public async getUser(secret: string): Promise<IUser> {
    const user: IUser = await this.httpClient.get(`/auth/user`, {
      headers: {
        'Authorization': `Bearer ${secret}`,
      },
    });

    return { ...user, name: 'John Doe' };
  }
}
