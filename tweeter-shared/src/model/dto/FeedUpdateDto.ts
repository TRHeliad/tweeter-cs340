import { StatusWithAliasDto } from "./StatusWithAliasDto";

export interface FeedUpdateDto {
  Status: StatusWithAliasDto;
  Followers: string[];
}
