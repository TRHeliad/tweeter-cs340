import { AuthTokenDAO } from "./AuthTokenDAO";
import { FollowDAO } from "./FollowDAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export interface TweeterDAOFactory {
  getFollowDAO: () => FollowDAO;
  getUserDAO: () => UserDAO;
  getAuthTokenDAO: () => AuthTokenDAO;
  getStatusDAO: () => StatusDAO;
}
