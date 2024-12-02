import { StatusDto, StatusWithAliasDto } from "tweeter-shared";
import { DataPage } from "./DataPage";

export interface StatusDAO {
  putStory: (status: StatusDto) => Promise<void>;
  putFeeds: (status: StatusDto, followerAliases: string[]) => Promise<void>;
  deleteStory: (status: StatusDto) => Promise<void>;
  deleteFeeds: (status: StatusDto, follwerAliases: string[]) => Promise<void>;

  getPageOfStory: (
    alias: string,
    lastLocation: number | undefined,
    limit: number
  ) => Promise<DataPage<StatusWithAliasDto>>;

  getPageOfFeed: (
    alias: string,
    lastLocation: string | undefined,
    limit: number
  ) => Promise<DataPage<StatusWithAliasDto>>;
}
