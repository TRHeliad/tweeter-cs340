import { RegisterRequest, TokenResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: RegisterRequest
): Promise<TokenResponse> => {
  const userService = new UserService();
  const [userDto, authTokenDto] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );
  return {
    success: true,
    message: null,
    user: userDto,
    authToken: authTokenDto,
  };
};
