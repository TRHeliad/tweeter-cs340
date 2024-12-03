import { Buffer } from "buffer";
import { User, UserDto } from "tweeter-shared";
import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";
import { TweeterDAOFactory } from "../dao/TweeterDAOFactory";
import { UserDAO } from "../dao/UserDAO";
import { SessionDAO } from "../dao/SessionDAO";
import { SessionService } from "./SessionService";

export class UserService {
  private readonly userDao: UserDAO;
  private readonly sessionDao: SessionDAO;
  private readonly sessionService: SessionService;

  constructor(daoFactory: TweeterDAOFactory) {
    this.userDao = daoFactory.getUserDAO();
    this.sessionDao = daoFactory.getSessionDAO();
    this.sessionService = new SessionService(daoFactory);
  }

  public async logout(token: string) {
    await this.sessionDao.deleteSession(token);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const fullUserDto = await this.userDao.getFullUser(alias);
    if (
      fullUserDto == undefined ||
      this.hashPassword(password) !== fullUserDto.passwordHash
    )
      throw new Error("Invalid alias or password");

    const userDto = {
      alias: fullUserDto.alias,
      firstName: fullUserDto.firstName,
      lastName: fullUserDto.lastName,
      imageUrl: fullUserDto.imageUrl,
    };

    const sessionDto = await this.sessionService.createNewSession(userDto);
    return [userDto, sessionDto.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const existingUser = await this.userDao.getUser(alias);
    if (existingUser !== undefined)
      throw new Error("[Bad Request] Alias taken");

    // upload image to s3 here
    const imageUrl = "";

    const fullUserDto = {
      alias: alias,
      passwordHash: this.hashPassword(password),
      firstName: firstName,
      lastName: lastName,
      imageUrl: imageUrl,
    };

    await this.userDao.putUser(fullUserDto);

    const user = new User(firstName, lastName, alias, imageUrl);
    const sessionDto = await this.sessionService.createNewSession(user.dto);
    return [user.dto, sessionDto.authToken];
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    this.sessionService.throwOnInvalidAuthToken(token);
    const userDto = (await this.userDao.getUser(alias)) ?? null;
    return userDto;
  }

  private hashPassword(password: string): string {
    return password;
  }
}
