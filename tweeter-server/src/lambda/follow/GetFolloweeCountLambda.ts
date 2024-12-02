import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { GetFollowCountLambda } from "./GetFollowCountLambda";
import { createFollowService } from "./CreateFollowService";

export const handler = async (
  request: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
  const followService = createFollowService();
  return GetFollowCountLambda(
    request,
    followService.getFolloweeCount.bind(followService)
  );
};
