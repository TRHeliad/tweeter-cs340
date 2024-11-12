import { TweeterRequest } from "./TweeterRequest";

export interface TokenRequest extends TweeterRequest {
  readonly alias: string;
  readonly password: string;
}
