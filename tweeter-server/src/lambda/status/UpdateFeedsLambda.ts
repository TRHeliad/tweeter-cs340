import { FeedUpdateDto } from "tweeter-shared";
import { createStatusService } from "./CreateStatusService";

export const handler = async function (event: any) {
  const statusService = createStatusService();

  console.log("processing new event", event.Records.length);

  for (let i = 0; i < event.Records.length; ++i) {
    let startTimeMillis = Date.now();
    const { body } = event.Records[i];
    const feedUpdate: FeedUpdateDto = JSON.parse(body);

    // Break followers into chunks of 25 (max batch write size)
    const followerChunks = [];
    for (let i = 0; i < feedUpdate.Followers.length; i += 25) {
      followerChunks.push(feedUpdate.Followers.slice(i, i + 25));
    }

    // let k = 0;
    for (let k = 0; k < followerChunks.length; ++k) {
      const followerChunk = followerChunks[k];
      // if (k % 4 == 0 && k != 0) startTimeMillis = Date.now();
      startTimeMillis = Date.now();

      await statusService.postFeeds(feedUpdate.Status, followerChunk);

      const elapsedTime = Date.now() - startTimeMillis;
      if (elapsedTime < 250) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, 250 - elapsedTime)
        );
      }

      // if ((k + 1) % 4 == 0) {
      //   const elapsedTime = Date.now() - startTimeMillis;
      //   if (elapsedTime < 1000) {
      //     await new Promise<void>((resolve) =>
      //       setTimeout(resolve, 1000 - elapsedTime)
      //     );
      //   }
      // }
      // k++;
    }

    // Size of a message indicates WCU, only do one message per second
    // const elapsedTime = Date.now() - startTimeMillis;
    // if (elapsedTime < 1000) {
    //   await new Promise<void>((resolve) =>
    //     setTimeout(resolve, 1000 - elapsedTime)
    //   );
    // }
  }
  return null;
};
