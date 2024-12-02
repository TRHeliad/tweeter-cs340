import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import { FollowAliasesDto } from "tweeter-shared";
import { FollowDto } from "tweeter-shared/dist/model/dto/FollowDto";
import { FollowDAO } from "../FollowDAO";
import { DataPage } from "../DataPage";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoFollowDAO extends DynamoDAO implements FollowDAO {
  readonly tableName = "Follow";
  readonly indexName = "Follow_index";
  readonly followerAliasAttribute = "follower-alias";
  readonly followeeAliasAttribute = "followee-alias";

  async putFollow(follow: FollowDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAliasAttribute]: follow.follower.alias,
        [this.followeeAliasAttribute]: follow.followee.alias,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async deleteFollow(follow: FollowDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowKey(follow),
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getPageOfFollowees(
    alias: string,
    lastLocation: string | undefined,
    limit: number
  ): Promise<DataPage<FollowAliasesDto>> {
    return this.getPageOfFollows(
      alias,
      this.followerAliasAttribute,
      lastLocation,
      limit
    );
  }

  async getPageOfFollowers(
    alias: string,
    lastLocation: string | undefined,
    limit: number
  ): Promise<DataPage<FollowAliasesDto>> {
    return this.getPageOfFollows(
      alias,
      this.followeeAliasAttribute,
      lastLocation,
      limit
    );
  }

  async getPageOfFollows(
    followAlias: string,
    queryAttribute: string,
    lastLocation: string | undefined = undefined,
    limit: number = 2
  ): Promise<DataPage<FollowAliasesDto>> {
    let targetAttribute: string;
    let useIndex: boolean = false;
    if (queryAttribute === this.followeeAliasAttribute) {
      targetAttribute = this.followerAliasAttribute;
      useIndex = true;
    } else {
      targetAttribute = this.followerAliasAttribute;
    }

    const params = {
      KeyConditionExpression: queryAttribute + " = :f",
      ExpressionAttributeValues: {
        ":f": followAlias,
      },
      TableName: this.tableName,
      IndexName: useIndex ? this.indexName : undefined,
      Limit: limit,
      ExclusiveStartKey:
        lastLocation === undefined
          ? undefined
          : {
              [queryAttribute]: followAlias,
              [targetAttribute]: lastLocation,
            },
    };

    const items: FollowAliasesDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push({
        followerAlias: item[this.followerAliasAttribute],
        followeeAlias: item[this.followeeAliasAttribute],
      })
    );
    return new DataPage<FollowAliasesDto>(items, hasMorePages);
  }

  private generateFollowKey(follow: FollowDto) {
    return {
      [this.followerAliasAttribute]: follow.follower.alias,
      [this.followeeAliasAttribute]: follow.followee.alias,
    };
  }
}