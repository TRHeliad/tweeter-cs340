import { PostStatusRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  statusService.postStatus(request.token, request.newStatus);
  return {
    success: true,
    message: null,
  };
};
