import { StatusDto } from "tweeter-shared";
import { DataPage } from "../DataPage";
import { StatusDAO } from "../StatusDAO";

export class DynamoStatusDAO implements StatusDAO {
  async putStatus(status: StatusDto): Promise<void> {}

  async deleteStatus(status: StatusDto): Promise<void> {}

  async getPageOfStory(
    alias: string,
    lastLocation: number | undefined,
    limit: number
  ): Promise<DataPage<StatusDto>> {}

  async getPageOfFeed(
    alias: string,
    lastLocation: string | undefined,
    limit: number
  ): Promise<DataPage<StatusDto>> {}
}
