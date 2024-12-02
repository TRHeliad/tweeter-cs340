import { FollowUpdateRequest, FollowUpdateResponse } from "tweeter-shared";
import { FollowUpdateLambda } from "./FollowUpdateLambda";
import { createFollowService } from "./CreateFollowService";

export const handler = async (
  request: FollowUpdateRequest
): Promise<FollowUpdateResponse> => {
  const followService = createFollowService();
  return FollowUpdateLambda(request, followService.follow.bind(followService));
};
