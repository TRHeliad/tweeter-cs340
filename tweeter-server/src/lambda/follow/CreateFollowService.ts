import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { FollowService } from "../../model/service/FollowService";

export function createFollowService() {
  return new FollowService(new DynamoDAOFactory());
}
