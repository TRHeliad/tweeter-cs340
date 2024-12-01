import {
  DeleteCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoAuthTokenDAO extends DynamoDAO implements AuthTokenDAO {
  readonly tableName = "AuthToken";
  readonly tokenAttribute = "token";
  readonly timestampAttribute = "timestamp";

  async putToken(authToken: AuthTokenDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.tokenAttribute]: authToken.token,
        [this.timestampAttribute]: authToken.timestamp,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async deleteToken(authToken: AuthTokenDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateAuthTokenKey(authToken),
    };
    await this.client.send(new DeleteCommand(params));
  }

  async updateToken(authToken: AuthTokenDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateAuthTokenKey(authToken),
      ExpressionAttributeValues: {
        ":timestamp": authToken.timestamp,
      },
      UpdateExpression: "SET " + this.timestampAttribute + " = :timestamp",
    };
    await this.client.send(new UpdateCommand(params));
  }

  private generateAuthTokenKey(authToken: AuthTokenDto) {
    return {
      [this.tokenAttribute]: authToken.token,
    };
  }
}
