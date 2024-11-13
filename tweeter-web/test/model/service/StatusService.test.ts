import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import "isomorphic-fetch";
import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";

describe("StatusService", () => {
  let statusService: StatusService;

  beforeEach(() => {
    const statusServiceSpy = spy(new StatusService());
    statusService = instance(statusServiceSpy);
  });

  it("returns a user's story pages", async () => {
    const authToken = new AuthToken("abc123", 0);

    const [stories, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      "@ben",
      2,
      null
    );

    expect(stories).toBeDefined();
  });
});
