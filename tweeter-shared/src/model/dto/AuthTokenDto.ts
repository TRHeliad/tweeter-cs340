import { Type } from "../domain/PostSegment";

export interface AuthTokenDto {
  readonly token: string;
  readonly timestamp: number;
}
