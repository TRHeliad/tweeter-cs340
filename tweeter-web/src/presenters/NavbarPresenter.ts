import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface NavbarView {
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    displayErrorMessage: (message: string) => void;
    clearUserInfo: () => void;
}

export class NavbarPresenter {
    private _view: NavbarView;
    private userService: UserService;

    public constructor(view: NavbarView) {
        this._view = view;
        this.userService = new UserService();
    }

    public async logout(authToken: AuthToken) {
        this._view.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.userService.logout(authToken!);
    
          this._view.clearLastInfoMessage();
          this._view.clearUserInfo();
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
          );
        }
      };
}