import { AuthToken, HasEqual } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<A> extends View {
  addItems: (newItems: A[]) => void;
}

export abstract class PagedItemPresenter<
  A extends HasEqual<A>,
  B
> extends Presenter<PagedItemView<A>> {
  private _hasMoreItems = true;
  private _lastItem: A | null = null;
  private _service: B;

  public constructor(view: PagedItemView<A>) {
    super(view);
    this._service = this.createService();
  }

  protected abstract createService(): B;

  protected get service(): B {
    return this._service;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem(): A | null {
    return this._lastItem;
  }

  protected set lastItem(value: A | null) {
    this._lastItem = value;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation(async () => {
      if (this.hasMoreItems) {
        const [newItems, hasMore] = await this.getMoreItems(
          authToken,
          userAlias
        );

        this.hasMoreItems = hasMore;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      }
    }, this.getItemDescription());
  }

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[A[], boolean]>;

  protected abstract getItemDescription(): string;
}
