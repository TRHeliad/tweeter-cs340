import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import { ServerFacade } from "../../src/net/ServerFacade";
import { ClientCommunicator } from "../../src/net/ClientCommunicator";
import "isomorphic-fetch";
import { User } from "tweeter-shared";

const SERVER_URL =
  "https://dn65c2keeh.execute-api.us-west-2.amazonaws.com/dev/";

describe("ServerFacade", () => {
  let serverFacade: ServerFacade;
  let clientCommunicatorSpy: ClientCommunicator;

  beforeEach(() => {
    clientCommunicatorSpy = spy(new ClientCommunicator(SERVER_URL));
    const clientCommunicatorInstance = instance(clientCommunicatorSpy);

    const serverFacadeSpy = spy(new ServerFacade());
    serverFacade = instance(serverFacadeSpy);

    when(serverFacadeSpy.clientCommunicator).thenReturn(
      clientCommunicatorInstance
    );
  });

  it("correctly retrieves data from the server for register", async () => {
    const request = {
      firstName: "first",
      lastName: "last",
      alias: "@alias",
      password: "abc123",
      userImageBytes: "",
      imageFileExtension: "png",
    };

    const [user, authToken] = await serverFacade.register(request);

    verify(clientCommunicatorSpy.doPost(request, anything())).once();

    expect(user).not.toBeFalsy();
    expect(authToken).not.toBeFalsy();
  });

  it("correctly retrieves data from the server for getting followers", async () => {
    const request = {
      token: "abc123",
      userAlias: "alias",
      pageSize: 2,
      lastItem: null,
    };

    const [users, hasMore] = await serverFacade.getFollowers(request);

    verify(clientCommunicatorSpy.doPost(request, anything())).once();

    expect(users).not.toBeFalsy();
  });

  it("correctly retrieves data from the server for getting follower count", async () => {
    const request = {
      token: "abc123",
      user: new User("first", "last", "@alias", "").dto,
    };

    const count = await serverFacade.getFollowerCount(request);

    verify(clientCommunicatorSpy.doPost(request, anything())).once();

    expect(count).toBeDefined();
  });
});
