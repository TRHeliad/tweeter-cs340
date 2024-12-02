import { PostStatusRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { createStatusService } from "./CreateStatusService";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = createStatusService();
  statusService.postStatus(request.token, request.newStatus);
  return {
    success: true,
    message: null,
  };
};
