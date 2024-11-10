import { UserDto } from "../../dto/UserDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface IsFollowerRequest extends AuthenticatedRequest {
  readonly user: UserDto;
  readonly selectedUser: UserDto;
}
