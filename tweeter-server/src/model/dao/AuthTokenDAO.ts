import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";
import { FollowDto } from "tweeter-shared/dist/model/dto/FollowDto";

export interface AuthTokenDAO {
  putToken: (token: AuthTokenDto) => Promise<void>;
  deleteToken: (token: AuthTokenDto) => Promise<void>;
  updateToken: (token: AuthTokenDto) => Promise<void>;
}
