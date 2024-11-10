import { UserDto } from "../../dto/UserDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface GetFollowCountRequest extends AuthenticatedRequest {
  readonly user: UserDto;
}
