import { TokenRequest, TokenResponse } from "tweeter-shared";
import { createUserService } from "./CreateUserService";

export const handler = async (
  request: TokenRequest
): Promise<TokenResponse> => {
  const userService = createUserService();
  const [userDto, authTokenDto] = await userService.login(
    request.alias,
    request.password
  );
  return {
    success: true,
    message: null,
    user: userDto,
    authToken: authTokenDto,
  };
};
