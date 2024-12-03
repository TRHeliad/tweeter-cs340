import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { PagedItemLambda } from "../PagedItemLambda";

export const UserItemLambda = async (
  request: PagedItemRequest<UserDto>,
  loadMethod: (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | undefined
  ) => Promise<[UserDto[], boolean]>
): Promise<PagedItemResponse<UserDto>> => {
  return PagedItemLambda(request, loadMethod);
};
