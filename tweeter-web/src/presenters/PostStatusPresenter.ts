import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService | null = null;

  public constructor(view: PostStatusView) {
    super(view);
  }

  public get statusService() {
    if (this._statusService == null) this._statusService = new StatusService();
    return this._statusService;
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser!, Date.now());

        await this.statusService.postStatus(authToken, status);

        this.view.clearLastInfoMessage();
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this.view.clearLastInfoMessage();
      }
    ).finally(() => {
      this.view.setIsLoading(false);
    });
  }
}
