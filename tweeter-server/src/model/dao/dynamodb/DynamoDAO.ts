import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoDAO {
  private static readonly _client = DynamoDBDocumentClient.from(
    new DynamoDBClient()
  );

  protected get client() {
    return DynamoDAO._client;
  }

  protected async runRetryingBatchWriteCommand(
    params: BatchWriteCommandInput,
    actionStr: string
  ) {
    try {
      const resp = await this.client.send(new BatchWriteCommand(params));
      await this.putUnprocessedItems(resp, params, actionStr);
    } catch (err) {
      throw new Error(
        `Error while ${actionStr} with params: ${params}: \n${err}`
      );
    }
    await this.client.send(new BatchWriteCommand(params));
  }

  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput,
    actionStr: string
  ) {
    let delay = 10;
    let attempts = 0;

    while (
      resp.UnprocessedItems !== undefined &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      attempts++;

      if (attempts > 1) {
        // Pause before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase pause time for next attempt
        if (delay < 1000) {
          delay += 100;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${
          Object.keys(resp.UnprocessedItems).length
        } unprocessed items for ${actionStr}.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}
