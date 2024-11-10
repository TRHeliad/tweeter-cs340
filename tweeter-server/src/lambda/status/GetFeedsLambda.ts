import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { UserItemLambda } from "./StatusItemLambda";

export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
  const statusService = new StatusService();
  return UserItemLambda(
    request,
    statusService.loadMoreFeedItems.bind(statusService)
  );
};
