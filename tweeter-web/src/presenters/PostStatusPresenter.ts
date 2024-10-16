import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.statusService = new StatusService();
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status").finally(() => {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    });
  }
}
