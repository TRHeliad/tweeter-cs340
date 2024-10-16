import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import {
  PAGE_SIZE,
  UserItemPresenter,
  UserItemView,
} from "./UserItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return "load followees";
  }
}
