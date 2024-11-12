import { TokenRequest, TokenResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: TokenRequest
): Promise<TokenResponse> => {
  const userService = new UserService();
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
