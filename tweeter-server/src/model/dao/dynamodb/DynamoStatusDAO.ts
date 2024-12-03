import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import { StatusDto, StatusWithAliasDto } from "tweeter-shared";
import { DataPage } from "../DataPage";
import { StatusDAO } from "../StatusDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoStatusDAO extends DynamoDAO implements StatusDAO {
  readonly storyTableName = "Story";
  readonly senderAliasAttribute = "sender-alias";
  readonly timestampAttribute = "timestamp";

  readonly feedTableName = "Feed";
  readonly receiverAliasAttribute = "receiver-alias";
  readonly feedDateAliasAttribute = "date-and-alias";

  readonly postAttribute = "post";

  async putStory(status: StatusDto): Promise<void> {
    const storyParams = {
      TableName: this.storyTableName,
      Item: {
        [this.senderAliasAttribute]: status.user.alias,
        [this.timestampAttribute]: status.timestamp,
        [this.postAttribute]: status.post,
      },
    };
    await this.client.send(new PutCommand(storyParams));
  }

  async putFeeds(status: StatusDto, followerAliases: string[]): Promise<void> {
    if (followerAliases && followerAliases.length > 0) {
      const feedParams = {
        RequestItems: {
          [this.feedTableName]: this.createPutFeedRequestItems(
            status,
            followerAliases
          ),
        },
      };

      await this.runRetryingBatchWriteCommand(
        feedParams,
        "batch writing feeds"
      );
    }
  }

  async deleteStory(status: StatusDto): Promise<void> {
    const storyParams = {
      TableName: this.storyTableName,
      Key: this.generateStoryPrimaryKey(status),
    };
    await this.client.send(new DeleteCommand(storyParams));
  }

  async deleteFeeds(
    status: StatusDto,
    followerAliases: string[]
  ): Promise<void> {
    if (followerAliases && followerAliases.length > 0) {
      const feedParams = {
        RequestItems: {
          [this.feedTableName]: this.createDeleteFeedRequestItems(
            status,
            followerAliases
          ),
        },
      };

      await this.runRetryingBatchWriteCommand(
        feedParams,
        "batch deleting feeds"
      );
    }
  }

  async getPageOfStory(
    alias: string,
    lastLocation: number | undefined,
    limit: number
  ): Promise<DataPage<StatusWithAliasDto>> {
    return this.getPageOfStatuses(
      alias,
      this.senderAliasAttribute,
      this.timestampAttribute,
      this.storyTableName,
      lastLocation,
      limit
    );
  }

  async getPageOfFeed(
    alias: string,
    lastLocation: StatusDto | undefined,
    limit: number
  ): Promise<DataPage<StatusWithAliasDto>> {
    return this.getPageOfStatuses(
      alias,
      this.receiverAliasAttribute,
      this.feedDateAliasAttribute,
      this.feedTableName,
      this.generateFeedSortKey(lastLocation),
      limit
    );
  }

  private async getPageOfStatuses(
    queryAlias: string,
    queryAttribute: string,
    sortAttribute: string | number,
    queryTable: string,
    lastLocation: string | number | undefined = undefined,
    limit: number = 2
  ): Promise<DataPage<StatusWithAliasDto>> {
    const params = {
      KeyConditionExpression: queryAttribute + " = :alias",
      ExpressionAttributeValues: {
        ":alias": queryAlias,
      },
      TableName: queryTable,
      Limit: limit,
      ExclusiveStartKey:
        lastLocation === undefined
          ? undefined
          : {
              [queryAttribute]: queryAlias,
              [sortAttribute]: lastLocation,
            },
    };

    const items: StatusWithAliasDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push({
        post: item[this.postAttribute],
        userAlias: item[this.senderAliasAttribute],
        timestamp: item[this.timestampAttribute],
      })
    );
    return new DataPage<StatusWithAliasDto>(items, hasMorePages);
  }

  private generateFeedSortKey(
    status: StatusDto | undefined
  ): string | undefined {
    if (status === undefined) return undefined;
    const date = new Date(status.timestamp);
    return date.toISOString() + status.user.alias;
  }

  private generateFeedPrimaryKey(status: StatusDto, followerAlias: string) {
    return {
      [this.receiverAliasAttribute]: followerAlias,
      [this.feedDateAliasAttribute]: this.generateFeedSortKey(status),
    };
  }

  private generateStoryPrimaryKey(status: StatusDto) {
    return {
      [this.senderAliasAttribute]: status.user.alias,
      [this.timestampAttribute]: status.timestamp,
    };
  }

  private createPutFeedRequestItems(
    status: StatusDto,
    followerAliases: string[]
  ) {
    return followerAliases.map((alias) =>
      this.createPutFeedRequest(status, alias)
    );
  }

  private createPutFeedRequest(status: StatusDto, followerAlias: string) {
    const item = {
      [this.receiverAliasAttribute]: followerAlias,
      [this.senderAliasAttribute]: status.user,
      [this.timestampAttribute]: status.timestamp,
      [this.feedDateAliasAttribute]: this.generateFeedSortKey(status),
      [this.postAttribute]: status.post,
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  private createDeleteFeedRequestItems(
    status: StatusDto,
    followerAliases: string[]
  ) {
    return followerAliases.map((alias) =>
      this.createDeleteFeedRequest(status, alias)
    );
  }

  private createDeleteFeedRequest(status: StatusDto, followerAlias: string) {
    const key = {
      [this.receiverAliasAttribute]: followerAlias,
      [this.feedDateAliasAttribute]: this.generateFeedSortKey(status),
    };

    return {
      DeleteRequest: {
        Key: key,
      },
    };
  }
}
