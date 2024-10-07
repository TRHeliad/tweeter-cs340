import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter {
    private _view: UserNavigationView;
    private userService: UserService;

    public constructor(view: UserNavigationView) {
        this._view = view;
        this.userService = new UserService();
    }

    public async navigateToUser(alias: string, currentUser: User, authToken: AuthToken): Promise<void> {
        try {
          const user = await this.userService.getUser(authToken!, alias);
  
          if (!!user) {
            if (currentUser.equals(user)) {
              this._view.setDisplayedUser(currentUser!);
            } else {
                this._view.setDisplayedUser(user);
            }
          }
        } catch (error) {
            this._view.displayErrorMessage(
            `Failed to get user because of exception: ${error}`
          );
        }
      }
}

const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };