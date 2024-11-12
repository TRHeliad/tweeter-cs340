import { UserDto } from "../../dto/UserDto";
import { UserRequest } from "./UserRequest";

export interface IsFollowerRequest extends UserRequest {
  readonly selectedUser: UserDto;
}
