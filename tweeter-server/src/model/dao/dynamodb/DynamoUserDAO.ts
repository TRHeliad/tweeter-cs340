import {
  BatchGetCommand,
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { FullUserDto, UserDto } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoUserDAO extends DynamoDAO implements UserDAO {
  readonly tableName = "User";
  readonly aliasAttribute = "alias";
  readonly passwordHashAttribute = "passwordHash";
  readonly firstNameAttribute = "firstName";
  readonly lastNameAttribute = "lastName";
  readonly imageUrlAttribute = "imageUrl";

  async putUser(registration: FullUserDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttribute]: registration.alias,
        [this.passwordHashAttribute]: registration.passwordHash,
        [this.firstNameAttribute]: registration.firstName,
        [this.lastNameAttribute]: registration.lastName,
        [this.imageUrlAttribute]: registration.imageUrl,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async deleteUser(user: UserDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateUserKey(user),
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getUser(alias: string): Promise<UserDto | undefined> {
    const fullUserDto = await this.getFullUser(alias);
    return fullUserDto == undefined
      ? undefined
      : {
          alias: fullUserDto.alias,
          firstName: fullUserDto.firstName,
          lastName: fullUserDto.lastName,
          imageUrl: fullUserDto.imageUrl,
        };
  }

  async getFullUser(alias: string): Promise<FullUserDto | undefined> {
    const params = {
      TableName: this.tableName,
      Key: { [this.aliasAttribute]: alias },
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : {
          alias: output.Item[this.aliasAttribute],
          passwordHash: output.Item[this.passwordHashAttribute],
          firstName: output.Item[this.firstNameAttribute],
          lastName: output.Item[this.lastNameAttribute],
          imageUrl: output.Item[this.imageUrlAttribute],
        };
  }

  async updateUser(user: UserDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateUserKey(user),
      ExpressionAttributeValues: {
        ":firstName": user.firstName,
        ":lastName": user.lastName,
        ":imageUrl": user.imageUrl,
      },
      UpdateExpression:
        "SET " +
        this.firstNameAttribute +
        " = :firstName, " +
        this.lastNameAttribute +
        " = :lastName," +
        this.imageUrlAttribute +
        " = :imageUrl",
    };
    await this.client.send(new UpdateCommand(params));
  }

  async batchGetUsers(aliases: string[]): Promise<UserDto[]> {
    if (aliases && aliases.length > 0) {
      // Deduplicate the aliases (only necessary if used in cases where there can be duplicates)
      const namesWithoutDuplicates = [...new Set(aliases)];

      const keys = namesWithoutDuplicates.map<Record<string, {}>>((alias) => ({
        [this.aliasAttribute]: alias,
      }));

      const params = {
        RequestItems: {
          [this.tableName]: {
            Keys: keys,
          },
        },
      };

      const result = await this.client.send(new BatchGetCommand(params));

      if (result.Responses) {
        return result.Responses[this.tableName].map<UserDto>(
          this.userDtoFromItem
        );
      }
    }

    return [];
  }

  private userDtoFromItem(item: Record<string, any>) {
    return {
      alias: item[this.aliasAttribute],
      firstName: item[this.firstNameAttribute],
      lastName: item[this.lastNameAttribute],
      imageUrl: item[this.imageUrlAttribute],
    };
  }

  private generateUserKey(user: UserDto) {
    return {
      [this.aliasAttribute]: user.alias,
    };
  }
}
