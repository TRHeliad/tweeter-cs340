import { UserDto } from "tweeter-shared";
import { FollowDto } from "tweeter-shared/dist/model/dto/FollowDto";
import { DataPage } from "./DataPage";

export interface FollowDAO {
  putFollow: (follow: FollowDto) => Promise<void>;
  deleteFollow: (follow: FollowDto) => Promise<void>;

  getPageOfFollowees: (
    alias: string,
    lastLocation: string | undefined,
    limit: number
  ) => Promise<DataPage<UserDto>>;

  getPageOfFollowers: (
    alias: string,
    lastLocation: string | undefined,
    limit: number
  ) => Promise<DataPage<UserDto>>;
}
