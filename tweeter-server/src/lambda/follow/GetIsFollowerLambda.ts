import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { createFollowService } from "./CreateFollowService";

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  const followService = createFollowService();
  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );
  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
