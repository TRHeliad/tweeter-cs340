import { RegisterRequest, TokenResponse } from "tweeter-shared";
import { createUserService } from "./CreateUserService";

export const handler = async (
  request: RegisterRequest
): Promise<TokenResponse> => {
  const userService = createUserService();
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
