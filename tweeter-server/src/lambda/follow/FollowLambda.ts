import { FollowUpdateRequest, FollowUpdateResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowUpdateLambda } from "./FollowUpdateLambda";

export const handler = async (
  request: FollowUpdateRequest
): Promise<FollowUpdateResponse> => {
  const followService = new FollowService();
  return FollowUpdateLambda(request, followService.follow.bind(followService));
};
