import { TokenRequest } from "./TokenRequest";

export interface RegisterRequest extends TokenRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly userImageBytes: string;
  readonly imageFileExtension: string;
}
