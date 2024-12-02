import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";
import { StatusService } from "../../model/service/StatusService";

export function createStatusService() {
  return new StatusService(new DynamoDAOFactory());
}
