import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";
import { SessionDAO } from "../SessionDAO";
import { DynamoDAO } from "./DynamoDAO";
import { SessionDto } from "tweeter-shared";

export class DynamoSessionDAO extends DynamoDAO implements SessionDAO {
  readonly tableName = "AuthToken";
  readonly tokenAttribute = "token";
  readonly timestampAttribute = "verifyTimestamp";
  readonly expirationAttribute = "expiration";
  readonly aliasAttribute = "alias";
  readonly tokenLifetime = 3600;

  async putSession(session: SessionDto): Promise<void> {
    const authToken = session.authToken;
    const params = {
      TableName: this.tableName,
      Item: {
        [this.tokenAttribute]: authToken.token,
        [this.timestampAttribute]: authToken.timestamp,
        [this.aliasAttribute]: session.userAlias,
        [this.expirationAttribute]: this.getExpirationTimestamp(
          authToken.timestamp
        ),
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getSession(token: string): Promise<SessionDto | undefined> {
    const params = {
      TableName: this.tableName,
      Key: { [this.tokenAttribute]: token },
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : {
          userAlias: output.Item[this.aliasAttribute],
          authToken: {
            token: output.Item[this.tokenAttribute],
            timestamp: output.Item[this.timestampAttribute],
          },
        };
  }

  async deleteSession(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateAuthTokenKey({ token: token, timestamp: 0 }),
    };
    await this.client.send(new DeleteCommand(params));
  }

  async updateSession(session: SessionDto): Promise<void> {
    const authToken = session.authToken;
    const params = {
      TableName: this.tableName,
      Key: this.generateAuthTokenKey(authToken),
      ExpressionAttributeValues: {
        ":ts": authToken.timestamp,
        ":ex": this.getExpirationTimestamp(authToken.timestamp),
      },
      UpdateExpression:
        "SET " +
        this.timestampAttribute +
        " = :ts, " +
        this.expirationAttribute +
        " = :ex",
    };
    await this.client.send(new UpdateCommand(params));
  }

  private generateAuthTokenKey(authToken: AuthTokenDto) {
    return {
      [this.tokenAttribute]: authToken.token,
    };
  }

  private getExpirationTimestamp(timestamp: number) {
    return Math.floor(timestamp / 1000) + 3600;
  }
}
