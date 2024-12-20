import {
  BatchWriteCommandInput,
  DeleteCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { StatusDto, StatusWithAliasDto } from "tweeter-shared";
import { DataPage } from "../DataPage";
import { StatusDAO } from "../StatusDAO";
import { DynamoDAO } from "./DynamoDAO";

type DeleteRequestItem = {
  DeleteRequest: {
    Key: {
      receiverAlias: string;
      dateAndAlias: string | undefined;
    };
  };
};

type PutRequestItem = {
  PutRequest: {
    Item: {
      receiverAlias: string;
      senderAlias: string;
      creationTimestamp: number;
      dateAndAlias: string;
      post: string;
    };
  };
};

export class DynamoStatusDAO extends DynamoDAO implements StatusDAO {
  readonly storyTableName = "Story";
  readonly senderAliasAttribute = "senderAlias";
  readonly timestampAttribute = "creationTimestamp";

  readonly feedTableName = "Feed";
  readonly receiverAliasAttribute = "receiverAlias";
  readonly feedDateAliasAttribute = "dateAndAlias";

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

  async putFeeds(
    status: StatusWithAliasDto,
    followerAliases: string[]
  ): Promise<void> {
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

  async addStoryToFeed(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    const getReferencePage = (lastItem: number | undefined) =>
      this.getPageOfStory(followeeAlias, lastItem, 25);
    const getLastItemFromPage = (page: DataPage<StatusWithAliasDto>) => {
      if (page.values.length > 0) return page.values.at(-1)?.timestamp;
    };
    const createUpdateFeedRequest = (
      status: StatusWithAliasDto,
      alias: string
    ) => this.createPutFeedRequest(status, alias);

    this.updateFeedFromStory(
      getReferencePage,
      getLastItemFromPage,
      followerAlias,
      createUpdateFeedRequest
    );
  }

  async removeStoryFromFeed(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    const getReferencePage = (lastItem: StatusWithAliasDto | undefined) =>
      this.getPageOfFeed(followerAlias, lastItem, 25);
    const getLastItemFromPage = (page: DataPage<StatusWithAliasDto>) => {
      if (page.values.length > 0) return page.values.at(-1);
    };
    const createUpdateFeedRequest = (
      status: StatusWithAliasDto,
      alias: string
    ) => {
      if (status.userAlias === followeeAlias)
        return this.createDeleteFeedRequest(status, alias);
    };

    this.updateFeedFromStory(
      getReferencePage,
      getLastItemFromPage,
      followerAlias,
      createUpdateFeedRequest
    );
  }

  private async updateFeedFromStory<T>(
    getReferencePage: (
      lastItem: T | undefined
    ) => Promise<DataPage<StatusWithAliasDto>>,
    getLastItemFromPage: (page: DataPage<StatusWithAliasDto>) => T | undefined,
    feedAlias: string,
    createUpdateFeedRequest: (
      status: StatusWithAliasDto,
      alias: string
    ) => DeleteRequestItem | PutRequestItem | undefined
  ): Promise<void> {
    let hasMore = true;
    let lastItem: T | undefined;
    while (hasMore) {
      const page = await getReferencePage(lastItem);
      hasMore = page.hasMorePages;

      const requests: (DeleteRequestItem | PutRequestItem)[] = [];
      page.values.forEach((statusWithAlias) => {
        const item = createUpdateFeedRequest(statusWithAlias, feedAlias);
        if (item !== undefined) requests.push(item);
      });

      if (page.values.length > 0) {
        lastItem = getLastItemFromPage(page);
        const feedParams = {
          RequestItems: {
            [this.feedTableName]: requests,
          },
        };

        await this.runRetryingBatchWriteCommand(
          feedParams,
          "batch writing feeds"
        );
      }
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
    lastLocation: StatusWithAliasDto | undefined,
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
      ScanIndexForward: false,
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
    status: StatusWithAliasDto | undefined
  ): string | undefined {
    if (status === undefined) return undefined;
    const date = new Date(status.timestamp);
    return date.toISOString() + status.userAlias;
  }

  private generateStoryPrimaryKey(status: StatusDto) {
    return {
      [this.senderAliasAttribute]: status.user.alias,
      [this.timestampAttribute]: status.timestamp,
    };
  }

  private createPutFeedRequestItems(
    status: StatusWithAliasDto,
    followerAliases: string[]
  ) {
    return followerAliases.map((alias) =>
      this.createPutFeedRequest(status, alias)
    );
  }

  private createPutFeedRequest(
    status: StatusWithAliasDto,
    followerAlias: string
  ): PutRequestItem {
    const item = {
      [this.receiverAliasAttribute]: followerAlias,
      [this.senderAliasAttribute]: status.userAlias,
      [this.timestampAttribute]: status.timestamp,
      [this.feedDateAliasAttribute]: this.generateFeedSortKey(status)!,
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
      this.createDeleteFeedRequest(this.aliasStatusFromStatusDto(status), alias)
    );
  }

  private createDeleteFeedRequest(
    status: StatusWithAliasDto,
    followerAlias: string
  ): DeleteRequestItem {
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

  private aliasStatusFromStatusDto(status: StatusDto): StatusWithAliasDto {
    return {
      post: status.post,
      userAlias: status.user.alias,
      timestamp: status.timestamp,
    };
  }
}
