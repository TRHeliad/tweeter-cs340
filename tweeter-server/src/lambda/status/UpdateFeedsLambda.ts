import { FeedUpdateDto, StatusWithAliasDto } from "tweeter-shared";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { createStatusService } from "./CreateStatusService";

let sqsClient = new SQSClient();

async function addToFeedQueue(
  newStatus: StatusWithAliasDto,
  followerAliases: string[]
): Promise<void> {
  const sqs_url =
    "https://sqs.us-west-2.amazonaws.com/954680681479/ExerciseQueue";
  const feedUpdate: FeedUpdateDto = {
    Status: newStatus,
    Followers: followerAliases,
  };
  const messageBody = JSON.stringify(feedUpdate);

  const params = {
    MessageBody: messageBody,
    QueueUrl: sqs_url,
  };

  try {
    await sqsClient.send(new SendMessageCommand(params));
  } catch (err) {
    throw err;
  }
}

export const handler = async function (event: any) {
  const statusService = createStatusService();

  for (let i = 0; i < event.Records.length; ++i) {
    const startTimeMillis = Date.now();

    const { body } = event.Records[i];
    const feedUpdate: FeedUpdateDto = JSON.parse(body);

    // Break followers into chunks of 25 (max batch write size)
    const followerChunks = [];
    for (let i = 0; i < feedUpdate.Followers.length; i += 25) {
      followerChunks.push(feedUpdate.Followers.slice(i, i + 25));
    }

    followerChunks.forEach(async (followerChunk) => {
      await statusService.postFeeds(feedUpdate.Status, followerChunk);
    });

    // Size of a message indicates WCU, only do one message per second
    const elapsedTime = Date.now() - startTimeMillis;
    if (elapsedTime < 1000) {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 1000 - elapsedTime)
      );
    }
  }
  return null;
};
