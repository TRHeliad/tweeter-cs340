import { FollowDto } from "tweeter-shared/dist/model/dto/FollowDto";
import { DataPage } from "./DataPage";
import { FollowAliasesDto } from "tweeter-shared";

export interface FollowDAO {
  putFollow: (follow: FollowDto) => Promise<void>;
  deleteFollow: (follow: FollowDto) => Promise<void>;

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
