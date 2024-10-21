import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface NavbarView extends MessageView {
  clearUserInfo: () => void;
}

export class NavbarPresenter extends Presenter<NavbarView> {
  private _userService: UserService | null = null;

  public constructor(view: NavbarView) {
    super(view);
  }

  public get userService() {
    if (this._userService == null) this._userService = new UserService();
    return this._userService;
  }

  public async logout(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
