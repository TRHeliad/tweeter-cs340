import { ServerFacade } from "../../net/ServerFacade";

export class TweeterWebService {
  _serverFacade: ServerFacade;

  public constructor() {
    this._serverFacade = this.createFacade();
  }

  protected createFacade() {
    return new ServerFacade();
  }

  protected get serverFacade(): ServerFacade {
    return this._serverFacade;
  }
}
