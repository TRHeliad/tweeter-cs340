import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { createUserService } from "./CreateUserService";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = createUserService();
  const userDto = await userService.getUser(request.token, request.alias);
  return {
    success: true,
    message: null,
    user: userDto,
  };
};
