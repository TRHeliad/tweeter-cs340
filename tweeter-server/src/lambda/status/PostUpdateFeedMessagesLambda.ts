import { FeedUpdateDto, StatusWithAliasDto } from "tweeter-shared";
import { createFollowService } from "../follow/CreateFollowService";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

let sqsClient = new SQSClient();

async function addToFeedQueue(
  newStatus: StatusWithAliasDto,
  followerAliases: string[]
): Promise<void> {
  const sqs_url =
    "https://sqs.us-west-2.amazonaws.com/954680681479/TweeterUpdateFeedQueue";
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
  let totalPosts = 0;

  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    const statusWithAlias: StatusWithAliasDto = JSON.parse(body);
    let lastItem: string | undefined;
    let hasMoreFollowers = true;
    while (hasMoreFollowers) {
      const startTimeMillis = Date.now();

      const [followerAliases, hasMore] = await followService.getFollowerAliases(
        "token",
        statusWithAlias.userAlias,
        1000,
        lastItem,
        true
      );
      hasMoreFollowers = hasMore;
      lastItem = followerAliases.at(-1);

      const followerChunks = [];
      for (let i = 0; i < followerAliases.length; i += 100) {
        followerChunks.push(followerAliases.slice(i, i + 100));
      }

      console.log("post", followerAliases.length, ++totalPosts);
      followerChunks.forEach(async (followerChunk) => {
        await addToFeedQueue(statusWithAlias, followerChunk);
      });

      // Prevent from throttling read capacity on followers
      const elapsedTime = Date.now() - startTimeMillis;
      if (elapsedTime < 500) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, 500 - elapsedTime)
        );
      }
    }
  }
  return null;
};
