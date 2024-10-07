import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export class UserInfoPresenter {
  private _view: UserInfoView;
  private followService: FollowService;

  public constructor(view: UserInfoView) {
    this._view = view;
    this.followService = new FollowService();
  }

  public switchToLoggedInUser(currentUser: User): void {
    this._view.setDisplayedUser(currentUser);
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this._view.setIsFollower(false);
      } else {
        this._view.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken,
            currentUser,
            displayedUser
          )
        );
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this._view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser)
      );
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this._view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser)
      );
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async followUser(user: User, authToken: AuthToken): Promise<void> {
    try {
      this._view.setIsLoading(true);
      this._view.displayInfoMessage(`Following ${user!.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken!,
        user!
      );

      this._view.setIsFollower(true);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._view.setIsLoading(false);
    }
  }

  public async unfollowUser(user: User, authToken: AuthToken): Promise<void> {
    try {
      this._view.setIsLoading(true);
      this._view.displayInfoMessage(`Unfollowing ${user.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken!,
        user!
      );

      this._view.setIsFollower(false);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._view.setIsLoading(false);
    }
  }
}
