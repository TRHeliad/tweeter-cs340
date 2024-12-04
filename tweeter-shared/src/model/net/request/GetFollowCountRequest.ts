import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface GetFollowCountRequest extends AuthenticatedRequest {
  readonly alias: string;
}
