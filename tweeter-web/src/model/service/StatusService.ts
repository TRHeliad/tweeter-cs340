import { AuthToken, Status } from "tweeter-shared";
import { TweeterWebService } from "./TweeterWebService";

export class StatusService extends TweeterWebService {
  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getStories({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    });
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getFeeds({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    });
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    await this.serverFacade.postStatus({
      token: authToken.token,
      newStatus: newStatus.dto,
    });
  }
}
