import { AuthToken, User } from "tweeter-shared";
import { TweeterWebService } from "./TweeterWebService";
import { Buffer } from "buffer";

export class UserService extends TweeterWebService {
  public async logout(authToken: AuthToken) {
	await this.serverFacade.logout({
		token: authToken.token
	});
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.serverFacade.login({
      alias: alias,
      password: password,
    });
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");
    return this.serverFacade.register({
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension,
    });
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.serverFacade.getUser({
      token: authToken.token,
      alias: alias,
    });
  }
}
