import { SessionDAO } from "./SessionDAO";
import { FollowDAO } from "./FollowDAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export interface TweeterDAOFactory {
  getFollowDAO: () => FollowDAO;
  getUserDAO: () => UserDAO;
  getSessionDAO: () => SessionDAO;
  getStatusDAO: () => StatusDAO;
}
