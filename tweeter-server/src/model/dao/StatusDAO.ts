import { StatusDto } from "tweeter-shared";
import { DataPage } from "./DataPage";

export interface StatusDAO {
  putStatus: (status: StatusDto) => Promise<void>;
  deleteStatus: (status: StatusDto) => Promise<void>;

  getPageOfStory: (
    alias: string,
    lastLocation: number | undefined,
    limit: number
  ) => Promise<DataPage<StatusDto>>;

  getPageOfFeed: (
    alias: string,
    lastLocation: string | undefined,
    limit: number
  ) => Promise<DataPage<StatusDto>>;
}
