import { AuthTokenDto, SessionDto } from "tweeter-shared";

export interface SessionDAO {
  putSession: (session: SessionDto) => Promise<void>;
  getSession: (token: string) => Promise<SessionDto | undefined>;
  deleteSession: (token: string) => Promise<void>;
  updateSession: (session: SessionDto) => Promise<void>;
}
