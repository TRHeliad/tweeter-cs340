import { UserDto } from "./UserDto";

export interface FullUserDto extends UserDto {
  readonly passwordHash: string;
}
