import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoDAO {
  private static readonly _client = DynamoDBDocumentClient.from(
    new DynamoDBClient()
  );
  protected get client() {
    return DynamoDAO._client;
  }
}
