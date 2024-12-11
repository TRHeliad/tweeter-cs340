import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import React from "react";
import { ServerFacade } from "../../src/net/ServerFacade";
import { ClientCommunicator } from "../../src/net/ClientCommunicator";
import "isomorphic-fetch";
import { AuthToken, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import PostStatus from "../../src/components/postStatus/PostStatus";

const SERVER_URL =
  "https://dn65c2keeh.execute-api.us-west-2.amazonaws.com/dev/";

describe("Post Status", () => {
  let serverFacade: ServerFacade;
  let clientCommunicatorSpy: ClientCommunicator;

  let actualUser: User;
  let authToken: AuthToken;

  beforeAll(async () => {
    clientCommunicatorSpy = spy(new ClientCommunicator(SERVER_URL));
    const clientCommunicatorInstance = instance(clientCommunicatorSpy);

    const serverFacadeSpy = spy(new ServerFacade());
    serverFacade = instance(serverFacadeSpy);

    when(serverFacadeSpy.clientCommunicator).thenReturn(
      clientCommunicatorInstance
    );

    [actualUser, authToken] = await serverFacade.login({
      alias: "@ben",
      password: "password",
    });
  });

  it("correctly adds a status to a user's story when the user sends a status", async () => {
    const mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    const postStatusPresenter = instance(postStatusPresenterSpy);

    const mockStatusService = mock<StatusService>();
    const mockUserServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(
      mockUserServiceInstance
    );

    const post = "test status";

    await postStatusPresenter.submitPost(post, actualUser, authToken);

    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", anything())
    ).once();

    const [statuses] = await serverFacade.getStories({
      token: authToken.token,
      userAlias: actualUser.alias,
      pageSize: 1,
      lastItem: undefined,
    });

    expect(statuses.length).toEqual(1);

    const status = statuses[0];

    expect(status.post).toEqual(post);
    expect(status.user.dto).toEqual(actualUser.dto);
  });
});
