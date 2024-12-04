import { UserService } from "../model/service/UserService";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {
  originalUrl: string | undefined;
}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  private userService: UserService;

  public constructor(view: LoginView) {
    super(view);
    this.userService = new UserService();
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    this.doAuthenticationOperation(
      async () => await this.userService.login("@" + alias, password),
      async () => {
        if (!!this.view.originalUrl) {
          this.view.navigate(this.view.originalUrl);
        } else {
          this.view.navigate("/");
        }
      },
      "log user in",
      rememberMe
    );
  }
}
