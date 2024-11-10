import {
  GetFollowCountRequest,
  GetFollowCountResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  UserDto,
} from "tweeter-shared";

export const GetFollowCountLambda = async (
  request: GetFollowCountRequest,
  getMethod: (token: string, user: UserDto) => Promise<number>
): Promise<GetFollowCountResponse> => {
  const count = await getMethod(request.token, request.user);
  return {
    success: true,
    message: null,
    count: count,
  };
};
