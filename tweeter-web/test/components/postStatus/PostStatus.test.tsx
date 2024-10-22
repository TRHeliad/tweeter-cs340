import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { instance, mock, verify } from "ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { AuthToken, User } from "tweeter-shared";

describe("PostStatus Component", () => {
  const currentUser: User = new User("a", "a", "a", "");
  const authToken: AuthToken = new AuthToken("abc", Date.now());

  it("starts with the post status and clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderLoginAndGetElement(
      currentUser,
      authToken
    );

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables post status and clear buttons when text field has text", async () => {
    const { postStatusButton, clearButton, textField, user } =
      renderLoginAndGetElement(currentUser, authToken);

    await user.type(textField, "abc123");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("post status and clear buttons are disabled when text field is cleared", async () => {
    const { postStatusButton, clearButton, textField, user } =
      renderLoginAndGetElement(currentUser, authToken);

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
      currentUser,
      authToken,
      mockPresenterInstance
    );

    const postText = "abc123";
    await user.type(textField, postText);

    await user.click(postStatusButton);

    verify(mockPresenter.submitPost(postText, currentUser, authToken)).once();
  });
});

const renderPostStatus = (
  currentUser: User,
  authToken: AuthToken,
  presenter?: PostStatusPresenter
) => {
  return render(
    <PostStatus presenter={presenter} userInfo={{ currentUser, authToken }} />
  );
};

const renderLoginAndGetElement = (
  currentUser: User,
  authToken: AuthToken,
  presenter?: PostStatusPresenter
) => {
  const user = userEvent.setup();

  renderPostStatus(currentUser, authToken, presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textField = screen.getByLabelText("postText");

  return { postStatusButton, clearButton, textField, user };
};
