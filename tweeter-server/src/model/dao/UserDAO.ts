import { UserDto } from "tweeter-shared";

export interface UserDAO {
  putUser: (user: UserDto) => Promise<void>;
  deleteUser: (user: UserDto) => Promise<void>;
  updateUser: (user: UserDto) => Promise<void>;
  getUser: (alias: string) => Promise<UserDto | undefined>;
  batchGetUsers: (aliases: string[]) => Promise<UserDto[]>;
}
