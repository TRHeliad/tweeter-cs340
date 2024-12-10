import { FeedUpdateDto } from "tweeter-shared";
import { createStatusService } from "./CreateStatusService";

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
