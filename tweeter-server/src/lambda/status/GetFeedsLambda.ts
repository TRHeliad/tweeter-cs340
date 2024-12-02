import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";
import { UserItemLambda } from "./StatusItemLambda";
import { createStatusService } from "./CreateStatusService";

export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
  const statusService = createStatusService();
  return UserItemLambda(
    request,
    statusService.loadMoreFeedItems.bind(statusService)
  );
};
