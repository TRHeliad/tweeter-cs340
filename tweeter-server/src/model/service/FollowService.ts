import {
  FakeData,
  FollowAliasesDto,
  SessionDto,
  User,
  UserDto,
} from "tweeter-shared";
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
    lastItem: UserDto | undefined
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
    lastItem: UserDto | undefined
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
    const doUpdate = async (sessionDto: SessionDto) => {
      const followAliasesDto = {
        followerAlias: sessionDto!.userAlias,
        followeeAlias: userToFollow.alias,
      };
      const alreadyFollowing = await this.followDao.getIsFollower(
        followAliasesDto
      );
      if (!alreadyFollowing) {
        this.followDao.putFollow(followAliasesDto);
        return this.updateFollowCounts(followAliasesDto, true);
      } else {
        return Promise.all([
          this.getFollowerCount(token, followAliasesDto.followeeAlias, true),
          this.getFolloweeCount(token, followAliasesDto.followeeAlias, true),
        ]);
      }
    };
    return this.updateFollowStatus(token, userToFollow, doUpdate);
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const doUpdate = async (sessionDto: SessionDto) => {
      const followAliasesDto = {
        followerAlias: sessionDto!.userAlias,
        followeeAlias: userToUnfollow.alias,
      };
      const alreadyFollowing = await this.followDao.getIsFollower(
        followAliasesDto
      );
      if (alreadyFollowing) {
        this.followDao.deleteFollow(followAliasesDto);
        return this.updateFollowCounts(followAliasesDto, false);
      } else {
        return Promise.all([
          this.getFollowerCount(token, followAliasesDto.followeeAlias, true),
          this.getFolloweeCount(token, followAliasesDto.followeeAlias, true),
        ]);
      }
    };
    return this.updateFollowStatus(token, userToUnfollow, doUpdate);
  }

  private async updateFollowCounts(
    followAliasesDto: FollowAliasesDto,
    isDoingFollow: boolean
  ): Promise<[number, number]> {
    const increment = isDoingFollow ? 1 : -1;
    const followerFullUser = await this.userDao.getFullUser(
      followAliasesDto.followerAlias
    );
    const followeeFullUser = await this.userDao.getFullUser(
      followAliasesDto.followeeAlias
    );
    const newFolloweeFollowerCount =
      followeeFullUser!.followerCount + increment;
    const followeeFolloweeCount = followeeFullUser!.followeeCount;

    this.userDao.updateFollowCount(
      followAliasesDto.followerAlias,
      followerFullUser!.followerCount,
      followerFullUser!.followeeCount + increment
    );
    this.userDao.updateFollowCount(
      followAliasesDto.followeeAlias,
      newFolloweeFollowerCount,
      followeeFolloweeCount
    );

    return [newFolloweeFollowerCount, followeeFolloweeCount];
  }

  private async updateFollowStatus(
    token: string,
    userToChange: UserDto,
    doUpdate: (sessionDto: SessionDto) => Promise<[number, number]>
  ): Promise<[followerCount: number, followeeCount: number]> {
    const [isValidToken, sessionDto] =
      await this.sessionService.isValidAuthToken(token);
    if (!isValidToken) throw this.sessionService.unauthenticatedError;

    return doUpdate(sessionDto!);
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.sessionService.throwOnInvalidAuthToken(token);
    return await this.followDao.getIsFollower({
      followerAlias: user.alias,
      followeeAlias: selectedUser.alias,
    });
  }

  public async getFolloweeCount(
    token: string,
    alias: string,
    alreadyVerified: boolean = false
  ): Promise<number> {
    if (!alreadyVerified)
      await this.sessionService.throwOnInvalidAuthToken(token);
    const fullUser = await this.userDao.getFullUser(alias);
    if (fullUser == undefined) throw Error("[Bad Request]: Invalid user");
    return fullUser.followeeCount;
  }

  public async getFollowerCount(
    token: string,
    alias: string,
    alreadyVerified: boolean = false
  ): Promise<number> {
    if (!alreadyVerified)
      await this.sessionService.throwOnInvalidAuthToken(token);
    const fullUser = await this.userDao.getFullUser(alias);
    if (fullUser == undefined) throw Error("[Bad Request]: Invalid user");
    return fullUser.followerCount;
  }
}
