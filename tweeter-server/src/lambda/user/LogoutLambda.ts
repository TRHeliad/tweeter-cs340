import { TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthenticatedRequest } from "tweeter-shared/dist/model/net/request/AuthenticatedRequest";

export const handler = async (
  request: AuthenticatedRequest
): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.logout(request.token);
  return {
    success: true,
    message: null,
  };
};
