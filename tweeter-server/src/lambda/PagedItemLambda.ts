import { PagedItemRequest, PagedItemResponse } from "tweeter-shared";

export const PagedItemLambda = async <T, K>(
  request: PagedItemRequest<K>,
  loadMethod: (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: K | undefined
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
