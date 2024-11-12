import { AuthToken, User } from "tweeter-shared";
import { TweeterWebService } from "./TweeterWebService";

export class UserService extends TweeterWebService {
  public async logout(authToken: AuthToken) {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
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
    return this.serverFacade.register({
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: userImageBytes,
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
