import { FullUserDto, UserDto } from "tweeter-shared";

export interface UserDAO {
  putUser: (user: FullUserDto) => Promise<void>;
  deleteUser: (user: UserDto) => Promise<void>;
  updateUser: (user: UserDto) => Promise<void>;
  updateFollowCount(
    alias: string,
    followerCount: number,
    followeeCount: number
  ): Promise<void>;
  getUser: (alias: string) => Promise<UserDto | undefined>;
  getFullUser: (alias: string) => Promise<FullUserDto | undefined>;
  batchGetUsers: (aliases: string[]) => Promise<UserDto[]>;
}
