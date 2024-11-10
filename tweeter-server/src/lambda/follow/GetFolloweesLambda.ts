import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { UserItemLambda } from "./UserItemLambda";

export const handler = async (
  request: PagedItemRequest<UserDto>
): Promise<PagedItemResponse<UserDto>> => {
  const followService = new FollowService();
  return UserItemLambda(
    request,
    followService.loadMoreFollowees.bind(followService)
  );
};
