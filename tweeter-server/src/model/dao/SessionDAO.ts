import { SessionDto } from "tweeter-shared";

export interface SessionDAO {
  putSession: (token: SessionDto) => Promise<void>;
  deleteSession: (token: SessionDto) => Promise<void>;
  updateSession: (token: SessionDto) => Promise<void>;
}
