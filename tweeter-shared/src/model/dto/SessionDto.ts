import { AuthTokenDto } from "./AuthTokenDto";

export interface SessionDto {
  readonly userAlias: string;
  readonly authToken: AuthTokenDto;
}
