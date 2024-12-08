import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";
import { SessionService } from "../model/service/SessionService";

export function createSessionService() {
  return new SessionService(new DynamoDAOFactory());
}
