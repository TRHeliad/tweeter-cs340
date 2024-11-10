import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";

export const PagedItemLambda = async <T>(
  request: PagedItemRequest<T>,
  loadMethod: (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: T | null
  ) => Promise<[T[], boolean]>
): Promise<PagedItemResponse<T>> => {
  const [items, hasMore] = await loadMethod(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
