import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface GetUserRequest extends AuthenticatedRequest {
  readonly alias: string;
}
