import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { PagedItemLambda } from "../PagedItemLambda";

export const UserItemLambda = async (
  request: PagedItemRequest<string>,
  loadMethod: (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: string | undefined
  ) => Promise<[UserDto[], boolean]>
): Promise<PagedItemResponse<UserDto>> => {
  return PagedItemLambda(request, loadMethod);
};
