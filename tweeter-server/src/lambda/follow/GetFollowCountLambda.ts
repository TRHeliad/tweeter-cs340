import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";

export const GetFollowCountLambda = async (
  request: GetFollowCountRequest,
  getMethod: (token: string, alias: string) => Promise<number>
): Promise<GetFollowCountResponse> => {
  const count = await getMethod(request.token, request.alias);
  return {
    success: true,
    message: null,
    count: count,
  };
};
