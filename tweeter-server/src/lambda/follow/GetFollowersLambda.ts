import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { UserItemLambda } from "./UserItemLambda";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
  return UserItemLambda(
    request,
    followService.loadMoreFollowers.bind(followService)
  );
};
