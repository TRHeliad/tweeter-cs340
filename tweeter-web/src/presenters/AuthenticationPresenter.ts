import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
	updateUserInfo: (
		currentUser: User,
		displayedUser: User | null,
		authToken: AuthToken,
		remember: boolean
	) => void;
	setIsLoading: (isLoading: boolean) => void;
	navigate: (path: string) => void;
}

export class AuthenticationPresenter<T extends AuthenticationView> extends Presenter<T> {
	public async doAuthenticationOperation(
		authenticate: () => Promise<[User, AuthToken]>,
		navigate: () => Promise<void>,
		operationDescription: string,
		rememberMe: boolean,
	): Promise<void> {
		this.doFailureReportingOperation(async () => {
			this.view.setIsLoading(true)
			const [user, authToken] = await authenticate();
			this.view.updateUserInfo(user, user, authToken, rememberMe);
			await navigate();
		}, operationDescription).finally(() => {
			this.view.setIsLoading(false)
		});
	}
}