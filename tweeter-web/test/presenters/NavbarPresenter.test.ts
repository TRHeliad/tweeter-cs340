import { AuthToken } from "tweeter-shared";
import {
  NavbarPresenter,
  NavbarView,
} from "../../src/presenters/NavbarPresenter";

import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("NavbarPresenter", () => {
  let mockNavbarView: NavbarView;
  let navbarPresenter: NavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockNavbarView = mock<NavbarView>();
    const mockNavbarViewInstance = instance(mockNavbarView);

    const navbarPresenterSpy = spy(new NavbarPresenter(mockNavbarViewInstance));
    navbarPresenter = instance(navbarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(navbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await navbarPresenter.logout(authToken);
    verify(mockNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await navbarPresenter.logout(authToken);
    verify(mockUserService.logout(authToken)).once();

    // let [capturedAuthToken] = capture(mockUserService.logout).last();
    // expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the last info message, clear the user info, and navigate to the login page when logout succeeds", async () => {
    await navbarPresenter.logout(authToken);

    verify(mockNavbarView.clearLastInfoMessage()).once();
    verify(mockNavbarView.clearUserInfo()).once();
  });

  it("displays an error message and does not clear the last info message, clear the user info, and navigate to the login page when logout fails", async () => {
    const error = new Error("An error ocurred");
    when(mockUserService.logout(authToken)).thenThrow(error);

    await navbarPresenter.logout(authToken);

    verify(
      mockNavbarView.displayErrorMessage(
        "Failed to log user out because of exception: An error ocurred"
      )
    ).once();

    verify(mockNavbarView.clearLastInfoMessage()).never();
    verify(mockNavbarView.clearUserInfo()).never();
  });
});
