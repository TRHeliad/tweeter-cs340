import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { GetFollowCountLambda } from "./GetFollowCountLambda";

export const handler = async (
  request: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
  const followService = new FollowService();
  return GetFollowCountLambda(
    request,
    followService.getFolloweeCount.bind(followService)
  );
};
