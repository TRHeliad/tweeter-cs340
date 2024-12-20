import { FollowDto } from "tweeter-shared/dist/model/dto/FollowDto";
import { DataPage } from "./DataPage";
import { FollowAliasesDto } from "tweeter-shared";

export interface FollowDAO {
  putFollow: (follow: FollowAliasesDto) => Promise<void>;
  deleteFollow: (follow: FollowAliasesDto) => Promise<void>;
  getIsFollower: (follow: FollowAliasesDto) => Promise<boolean>;

  getPageOfFollowees: (
    alias: string,
    lastLocation: string | undefined,
    limit: number
  ) => Promise<DataPage<FollowAliasesDto>>;

  getPageOfFollowers: (
    alias: string,
    lastLocation: string | undefined,
    limit: number
  ) => Promise<DataPage<FollowAliasesDto>>;
}
