import { TweeterResponse } from "./TweeterResponse";

export interface FollowUpdateResponse extends TweeterResponse {
  readonly followerCount: number;
  readonly followeeCount: number;
}
