import { PagedItemRequest, PagedItemResponse } from "tweeter-shared";

export const PagedItemLambda = async <T>(
  request: PagedItemRequest<T>,
  loadMethod: (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: T | undefined
  ) => Promise<[T[], boolean]>
): Promise<PagedItemResponse<T>> => {
  const [items, hasMore] = await loadMethod(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem ?? undefined
  );
  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
