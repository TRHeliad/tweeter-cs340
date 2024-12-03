import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";
import { PagedItemLambda } from "../PagedItemLambda";

export const UserItemLambda = async (
  request: PagedItemRequest<StatusDto>,
  loadMethod: (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | undefined
  ) => Promise<[StatusDto[], boolean]>
): Promise<PagedItemResponse<StatusDto>> => {
  return PagedItemLambda(request, loadMethod);
};
