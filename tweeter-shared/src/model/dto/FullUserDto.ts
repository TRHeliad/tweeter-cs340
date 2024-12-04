import { UserDto } from "./UserDto";

export interface FullUserDto extends UserDto {
  readonly passwordHash: string;
  readonly followerCount: number;
  readonly followeeCount: number;
}
