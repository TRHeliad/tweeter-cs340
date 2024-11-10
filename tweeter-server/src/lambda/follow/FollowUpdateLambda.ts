import {
  FollowUpdateRequest,
  FollowUpdateResponse,
  UserDto,
} from "tweeter-shared";

export const FollowUpdateLambda = async (
  request: FollowUpdateRequest,
  updateMethod: (
    token: string,
    userToChange: UserDto
  ) => Promise<[followerCount: number, followeeCount: number]>
): Promise<FollowUpdateResponse> => {
  const [followerCount, followeeCount] = await updateMethod(
    request.token,
    request.user
  );
  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
