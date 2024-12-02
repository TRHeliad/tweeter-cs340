import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { UserService } from "../../model/service/UserService";

export function createUserService() {
  return new UserService(new DynamoDAOFactory());
}
