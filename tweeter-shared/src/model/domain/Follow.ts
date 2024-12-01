import { FollowDto } from "../dto/FollowDto";
import { DtoConvertible } from "./DtoConvertible";
import { User } from "./User";

export class Follow extends DtoConvertible<FollowDto> {
  private _follower: User;
  private _followee: User;

  public constructor(follower: User, followee: User) {
    super();
    this._follower = follower;
    this._followee = followee;
  }

  public static fromDto(dto: FollowDto | null): Follow | null {
    return dto == null
      ? null
      : new Follow(User.fromDto(dto.follower)!, User.fromDto(dto.followee)!);
  }

  public get dto(): FollowDto {
    return {
      follower: this.follower.dto,
      followee: this.followee.dto,
    };
  }

  public get follower(): User {
    return this._follower;
  }

  public set follower(value: User) {
    this._follower = value;
  }

  public get followee(): User {
    return this._followee;
  }

  public set followee(value: User) {
    this._followee = value;
  }
}
