import { TweeterResponse } from "tweeter-shared";
import { AuthenticatedRequest } from "tweeter-shared/dist/model/net/request/AuthenticatedRequest";
import { createUserService } from "./CreateUserService";

export const handler = async (
  request: AuthenticatedRequest
): Promise<TweeterResponse> => {
  const userService = createUserService();
  await userService.logout(request.token);
  return {
    success: true,
    message: null,
  };
};
