import { StatusDto } from "../../dto/StatusDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface PostStatusRequest extends AuthenticatedRequest {
  readonly newStatus: StatusDto;
}
