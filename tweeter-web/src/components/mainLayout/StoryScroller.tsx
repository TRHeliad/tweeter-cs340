import { AuthToken, FakeData, Status } from "tweeter-shared";
import StatusItemScroller from "./StatusItemScroller";

export const PAGE_SIZE = 10;

const StoryScroller = () => {
  const loadMoreStoryItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return (
    <StatusItemScroller
      itemDescription="story"
      loadMoreItems={loadMoreStoryItems}
    />
  );
};

export default StoryScroller;
