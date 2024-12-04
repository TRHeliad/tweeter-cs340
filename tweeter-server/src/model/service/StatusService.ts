import { StatusDto, StatusWithAliasDto, UserDto } from "tweeter-shared";
import { StatusDAO } from "../dao/StatusDAO";
import { TweeterDAOFactory } from "../dao/TweeterDAOFactory";
import { SessionService } from "./SessionService";
import { UserDAO } from "../dao/UserDAO";
import { FollowDAO } from "../dao/FollowDAO";

export class StatusService {
  private readonly statusDao: StatusDAO;
  private readonly userDao: UserDAO;
  private readonly followDao: FollowDAO;
  private readonly sessionService: SessionService;

  constructor(daoFactory: TweeterDAOFactory) {
    this.statusDao = daoFactory.getStatusDAO();
    this.userDao = daoFactory.getUserDAO();
    this.followDao = daoFactory.getFollowDAO();
    this.sessionService = new SessionService(daoFactory);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | undefined
  ): Promise<[StatusDto[], boolean]> {
    this.sessionService.throwOnInvalidAuthToken(token);

    const page = await this.statusDao.getPageOfStory(
      userAlias,
      lastItem?.timestamp,
      pageSize
    );
    const aliasStatuses = page.values;
    const statuses = await this.getStatusesFromAliasStatuses(aliasStatuses);

    return [statuses, page.hasMorePages];
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | undefined
  ): Promise<[StatusDto[], boolean]> {
    this.sessionService.throwOnInvalidAuthToken(token);

    const page = await this.statusDao.getPageOfFeed(
      userAlias,
      lastItem,
      pageSize
    );
    const aliasStatuses = page.values;
    const statuses = await this.getStatusesFromAliasStatuses(aliasStatuses);

    return [statuses, page.hasMorePages];
  }

  private async getStatusesFromAliasStatuses(
    aliasStatuses: StatusWithAliasDto[]
  ): Promise<StatusDto[]> {
    const userAliases = aliasStatuses.map((item) => item.userAlias);
    const users = await this.userDao.batchGetUsers(userAliases);
    const userDict: { [key: string]: UserDto } = {};
    users.forEach((user) => {
      userDict[user.alias] = user;
    });
    const statuses: StatusDto[] = [];
    for (let i = 0; i < aliasStatuses.length; i++) {
      statuses[i] = {
        post: aliasStatuses[i].post,
        user: userDict[aliasStatuses[i].userAlias],
        timestamp: aliasStatuses[i].timestamp,
      };
    }
    return statuses;
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    const [isValidToken, sessionDto] =
      await this.sessionService.isValidAuthToken(token);
    if (!isValidToken) throw this.sessionService.unauthenticatedError;

    this.statusDao.putStory(newStatus);

    // replace with milestone 4B
    const page = await this.followDao.getPageOfFollowers(
      sessionDto!.userAlias,
      undefined,
      25
    );
    const followerAliases = page.values.map((item) => item.followerAlias);
    await this.statusDao.putFeeds(newStatus, followerAliases);
  }
}
