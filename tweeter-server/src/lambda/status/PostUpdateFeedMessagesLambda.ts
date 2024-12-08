import { FeedUpdateDto, StatusWithAliasDto } from "tweeter-shared";
import { createFollowService } from "../follow/CreateFollowService";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

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
  const followService = createFollowService();

  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    const statusWithAlias: StatusWithAliasDto = JSON.parse(body);
    let lastItem: string | undefined;
    let hasMoreFollowers = true;
    while (hasMoreFollowers) {
      const [followerAliases, hasMore] = await followService.getFollowerAliases(
        "token",
        statusWithAlias.userAlias,
        100,
        lastItem,
        true
      );
      hasMoreFollowers = hasMore;
      await addToFeedQueue(statusWithAlias, followerAliases);
    }
  }
  return null;
};
