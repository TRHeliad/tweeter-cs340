import { AuthToken, SessionDto, UserDto } from "tweeter-shared";
import { TweeterDAOFactory } from "../dao/TweeterDAOFactory";
import { SessionDAO } from "../dao/SessionDAO";

export class SessionService {
  private readonly sessionDao: SessionDAO;
  public readonly unauthenticatedError = new Error(
    "[Bad Request] unauthenticated request"
  );

  constructor(daoFactory: TweeterDAOFactory) {
    this.sessionDao = daoFactory.getSessionDAO();
  }

  async isValidAuthToken(
    token: string
  ): Promise<[boolean, SessionDto | undefined]> {
    const sessionDto = await this.sessionDao.getSession(token);
    const now = Date.now();
    if (sessionDto !== undefined && sessionDto.authToken.timestamp < now) {
      return [true, sessionDto];
    }
    return [false, sessionDto];
  }

  async throwOnInvalidAuthToken(token: string): Promise<void> {
    if (!this.isValidAuthToken(token)) throw this.unauthenticatedError;
  }

  async createNewSession(userDto: UserDto): Promise<SessionDto> {
    const authToken = AuthToken.Generate();
    const sessionDto = {
      userAlias: userDto.alias,
      authToken: authToken.dto,
    };

    this.sessionDao.putSession(sessionDto);

    return sessionDto;
  }
}
