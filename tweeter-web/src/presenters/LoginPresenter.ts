import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
    navigate: (path: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    displayErrorMessage: (message: string) => void;
    originalUrl: string | undefined;

}

export class LoginPresenter {
    private _view: LoginView;
    private userService: UserService;

    public constructor(view: LoginView) {
        this._view = view;
        this.userService = new UserService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean) {
        try {
            this._view.setIsLoading(true);

            const [user, authToken] = await this.userService.login(alias, password);

            this._view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!this._view.originalUrl) {
                this._view.navigate(this._view.originalUrl);
            } else {
                this._view.navigate("/");
            }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        } finally {
            this._view.setIsLoading(false);
        }
    };
}