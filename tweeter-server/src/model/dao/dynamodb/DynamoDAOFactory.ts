import { SessionDAO } from "../SessionDAO";
import { FollowDAO } from "../FollowDAO";
import { StatusDAO } from "../StatusDAO";
import { TweeterDAOFactory } from "../TweeterDAOFactory";
import { UserDAO } from "../UserDAO";
import { DynamoSessionDAO } from "./DynamoSessionDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";
import { UserImageDAO } from "../UserImageDAO";
import { S3UserImageDAO } from "./S3UserImageDAO";

export class DynamoDAOFactory implements TweeterDAOFactory {
  getFollowDAO(): FollowDAO {
    return new DynamoFollowDAO();
  }

  getUserDAO(): UserDAO {
    return new DynamoUserDAO();
  }

  getSessionDAO(): SessionDAO {
    return new DynamoSessionDAO();
  }

  getStatusDAO(): StatusDAO {
    return new DynamoStatusDAO();
  }

  getUserImageDAO(): UserImageDAO {
    return new S3UserImageDAO();
  }
}
