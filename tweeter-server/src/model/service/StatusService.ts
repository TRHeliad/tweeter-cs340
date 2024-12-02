import { AuthToken, FakeData, Status, StatusDto } from "tweeter-shared";
import { StatusDAO } from "../dao/StatusDAO";
import { TweeterDAOFactory } from "../dao/TweeterDAOFactory";

export class StatusService {
  private readonly statusDao: StatusDAO;

  constructor(daoFactory: TweeterDAOFactory) {
    this.statusDao = daoFactory.getStatusDAO();
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  }

  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = statuses.map((status) => status.dto);
    return [dtos, hasMore];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    // Pause so we can see the posting status message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}
