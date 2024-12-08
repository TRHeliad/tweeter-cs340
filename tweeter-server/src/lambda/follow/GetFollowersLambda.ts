import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { UserItemLambda } from "./UserItemLambda";
import { createFollowService } from "./CreateFollowService";

export const handler = async (
  request: PagedItemRequest<string>
): Promise<PagedItemResponse<UserDto>> => {
  const followService = createFollowService();
  return UserItemLambda(
    request,
    followService.loadMoreFollowers.bind(followService)
  );
};
