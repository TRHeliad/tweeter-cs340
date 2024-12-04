import { AuthTokenDto, SessionDto } from "tweeter-shared";

export interface UserImageDAO {
  putImage: (
    fileName: string,
    imageStringBase64Encoded: string
  ) => Promise<string>;
}
