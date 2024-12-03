import { FakeData, SessionDto, User, UserDto } from "tweeter-shared";
import { TweeterDAOFactory } from "../dao/TweeterDAOFactory";
import { FollowDAO } from "../dao/FollowDAO";
import { UserDAO } from "../dao/UserDAO";
import { SessionService } from "./SessionService";

export class FollowService {
  private readonly followDao: FollowDAO;
  private readonly userDao: UserDAO;
  private readonly sessionService: SessionService;

  constructor(daoFactory: TweeterDAOFactory) {
    this.followDao = daoFactory.getFollowDAO();
    this.userDao = daoFactory.getUserDAO();
    this.sessionService = new SessionService(daoFactory);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    this.sessionService.throwOnInvalidAuthToken(token);

    const page = await this.followDao.getPageOfFollowers(
      userAlias,
      lastItem?.alias,
      pageSize
    );
    const aliasFollows = page.values;

    const followerAliases = aliasFollows.map((item) => item.followerAlias);
    const followers = await this.userDao.batchGetUsers(followerAliases);

    return [followers, page.hasMorePages];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    this.sessionService.throwOnInvalidAuthToken(token);

    const page = await this.followDao.getPageOfFollowees(
      userAlias,
      lastItem?.alias,
      pageSize
    );
    const aliasFollows = page.values;

    const followeeAliases = aliasFollows.map((item) => item.followeeAlias);
    const followees = await this.userDao.batchGetUsers(followeeAliases);

    return [followees, page.hasMorePages];
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const doUpdate = async (sessionDto: SessionDto) =>
      this.followDao.putFollow({
        followerAlias: sessionDto!.userAlias,
        followeeAlias: userToFollow.alias,
      });
    return this.updateFollowStatus(token, userToFollow, doUpdate);
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const doUpdate = async (sessionDto: SessionDto) =>
      this.followDao.deleteFollow({
        followerAlias: sessionDto!.userAlias,
        followeeAlias: userToUnfollow.alias,
      });
    return this.updateFollowStatus(token, userToUnfollow, doUpdate);
  }

  private async updateFollowStatus(
    token: string,
    userToChange: UserDto,
    doUpdate: (sessionDto: SessionDto) => Promise<void>
  ): Promise<[followerCount: number, followeeCount: number]> {
    const [isValidToken, sessionDto] =
      await this.sessionService.isValidAuthToken(token);
    if (!isValidToken) throw this.sessionService.unauthenticatedError;

    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    await doUpdate(sessionDto!);

    const user = User.fromDto(userToChange)!;
    const followerCount = await this.getFollowerCount(token, user);
    const followeeCount = await this.getFolloweeCount(token, user);

    return [followerCount, followeeCount];
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    const [isValidToken, sessionDto] =
      await this.sessionService.isValidAuthToken(token);
    if (!isValidToken) throw this.sessionService.unauthenticatedError;
    return await this.followDao.getIsFollower({
      followerAlias: sessionDto!.userAlias,
      followeeAlias: selectedUser.alias,
    });
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }
}
