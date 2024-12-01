import { AuthTokenDAO } from "./AuthTokenDAO";
import { FollowDAO } from "./FollowDAO";
import { UserDAO } from "./UserDAO";

export interface TweeterDAOFactory {
  getFollowDAO: () => FollowDAO;
  getUserDAO: () => UserDAO;
  getAuthTokenDAO: () => AuthTokenDAO;
}
