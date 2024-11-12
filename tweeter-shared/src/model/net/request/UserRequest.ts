import { UserDto } from "../../dto/UserDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface UserRequest extends AuthenticatedRequest {
  readonly user: UserDto;
}
