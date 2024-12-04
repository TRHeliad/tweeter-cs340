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

type PrimaryKey = { [key: string]: string };

export class DynamoUserDAO extends DynamoDAO implements UserDAO {
  readonly tableName = "User";
  readonly aliasAttribute = "alias";
  readonly passwordHashAttribute = "passwordHash";
  readonly firstNameAttribute = "firstName";
  readonly lastNameAttribute = "lastName";
  readonly imageUrlAttribute = "imageUrl";
  readonly followerCountAttribute = "followerCount";
  readonly followeeCountAttribute = "followeeCount";

  async putUser(registration: FullUserDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttribute]: registration.alias,
        [this.passwordHashAttribute]: registration.passwordHash,
        [this.firstNameAttribute]: registration.firstName,
        [this.lastNameAttribute]: registration.lastName,
        [this.imageUrlAttribute]: registration.imageUrl,
        [this.followerCountAttribute]: 0,
        [this.followeeCountAttribute]: 0,
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
          followerCount: output.Item[this.followerCountAttribute],
          followeeCount: output.Item[this.followeeCountAttribute],
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

  async updateFollowCount(
    alias: string,
    followerCount: number,
    followeeCount: number
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { [this.aliasAttribute]: alias },
      ExpressionAttributeValues: {
        ":fer": followerCount,
        ":fee": followeeCount,
      },
      UpdateExpression:
        "SET " +
        this.followerCountAttribute +
        " = :fer, " +
        this.followeeCountAttribute +
        " = :fee",
    };
    await this.client.send(new UpdateCommand(params));
  }

  async batchGetUsers(aliases: string[]): Promise<UserDto[]> {
    if (aliases && aliases.length > 0) {
      const keys: PrimaryKey[] = [];
      const alreadyEntered: { [alias: string]: boolean } = {};
      aliases.forEach((alias) => {
        if (!(alias in alreadyEntered)) {
          alreadyEntered[alias] = true;
          keys.push({
            [this.aliasAttribute]: alias,
          });
        }
      });

      const params = {
        RequestItems: {
          [this.tableName]: {
            Keys: keys,
          },
        },
      };

      const result = await this.client.send(new BatchGetCommand(params));

      if (result.Responses) {
        const itemMap: { [key: string]: Record<string, any> } = {};
        result.Responses[this.tableName].forEach((item) => {
          itemMap[item.alias] = item;
        });
        const users: UserDto[] = [];
        aliases.forEach((alias) => {
          if (alias in itemMap)
            users.push(this.userDtoFromItem(itemMap[alias]));
        });
        return users;
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
