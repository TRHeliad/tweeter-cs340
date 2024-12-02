import { AuthTokenDAO } from "../AuthTokenDAO";
import { FollowDAO } from "../FollowDAO";
import { StatusDAO } from "../StatusDAO";
import { TweeterDAOFactory } from "../TweeterDAOFactory";
import { UserDAO } from "../UserDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

export class DynamoDAOFactory implements TweeterDAOFactory {
  getFollowDAO(): FollowDAO {
    return new DynamoFollowDAO();
  }

  getUserDAO(): UserDAO {
    return new DynamoUserDAO();
  }

  getAuthTokenDAO(): AuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }

  getStatusDAO(): StatusDAO {
    return new DynamoStatusDAO();
  }
}