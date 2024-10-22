import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { instance, mock, verify } from "ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { UserInfo } from "../../../src/components/userInfo/UserInfoProvider";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    const mockUser = mock<User>();
    const mockAuthToken = mock<AuthToken>();
    mockUserInstance = instance(mockUser);
    mockAuthTokenInstance = instance(mockAuthToken);

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with the post status and clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderLoginAndGetElement(
      useUserInfo()
    );

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables post status and clear buttons when text field has text", async () => {
    const { postStatusButton, clearButton, textField, user } =
      renderLoginAndGetElement(useUserInfo());

    await user.type(textField, "abc123");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("post status and clear buttons are disabled when text field is cleared", async () => {
    const { postStatusButton, clearButton, textField, user } =
      renderLoginAndGetElement(useUserInfo());

    await user.type(textField, "abc123");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("postStatus is called with the correct parameters when the post status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postStatusButton, textField, user } = renderLoginAndGetElement(
      useUserInfo(),
      mockPresenterInstance
    );

    const postText = "abc123";
    await user.type(textField, postText);

    await user.click(postStatusButton);

    verify(
      mockPresenter.submitPost(
        postText,
        mockUserInstance,
        mockAuthTokenInstance
      )
    ).once();
  });
});

const renderPostStatus = (
  userInfo: UserInfo,
  presenter?: PostStatusPresenter
) => {
  return render(<PostStatus presenter={presenter} userInfo={userInfo} />);
};

const renderLoginAndGetElement = (
  userInfo: UserInfo,
  presenter?: PostStatusPresenter
) => {
  const user = userEvent.setup();

  renderPostStatus(userInfo, presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textField = screen.getByLabelText("postText");

  return { postStatusButton, clearButton, textField, user };
};
