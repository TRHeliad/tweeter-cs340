import {
  PostStatusRequest,
  StatusDto,
  StatusWithAliasDto,
} from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { createStatusService } from "./CreateStatusService";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { createSessionService } from "../CreateSessionService";

let sqsClient = new SQSClient();

async function addToPostQueue(newStatus: StatusWithAliasDto): Promise<void> {
  const sqs_url =
    "https://sqs.us-west-2.amazonaws.com/954680681479/TweeterPostStatusQueue";
  const messageBody = JSON.stringify(newStatus);

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

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = createStatusService();
  const sessionService = createSessionService();

  const now = Date.now();
  const status: StatusDto = {
    post: request.newStatus.post,
    timestamp: now,
    user: request.newStatus.user,
  };

  await sessionService.throwOnInvalidAuthToken(request.token);

  await addToPostQueue({
    post: status.post,
    timestamp: now,
    userAlias: status.user.alias,
  });
  await statusService.postStory(request.token, request.newStatus, true);

  return {
    success: true,
    message: null,
  };
};
