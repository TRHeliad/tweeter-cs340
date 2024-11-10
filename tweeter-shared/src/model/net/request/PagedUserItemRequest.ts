import { UserDto } from "../../dto/UserDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface PagedUserItemRequest extends AuthenticatedRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: UserDto | null;
}
