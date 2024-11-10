import { UserDto } from "../../dto/UserDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface FollowUpdateRequest extends AuthenticatedRequest {
  readonly user: UserDto;
}
