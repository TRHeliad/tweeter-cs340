import {
  AuthToken,
  FollowUpdateRequest,
  FollowUpdateResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  StatusDto,
  TokenRequest,
  TokenResponse,
  TweeterResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://dn65c2keeh.execute-api.us-west-2.amazonaws.com/dev/";

  private _clientCommunicator: ClientCommunicator | null = null;

  public get clientCommunicator() {
    if (this._clientCommunicator == null)
      this._clientCommunicator = new ClientCommunicator(this.SERVER_URL);
    return this._clientCommunicator;
  }

  private handleResponseError<T extends TweeterResponse>(response: T): never {
    console.error(response);
    throw new Error(response.message ?? undefined);
  }

  private async getMorePagedItems<DtoType, ModelType>(
    request: PagedItemRequest<DtoType>,
    methodPath: string,
    noneFoundMessage: string,
    fromDto: (dto: DtoType) => ModelType | null
  ): Promise<[ModelType[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<DtoType>,
      PagedItemResponse<DtoType>
    >(request, methodPath);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: ModelType[] | null =
      response.success && response.items
        ? response.items.map((dto) => fromDto(dto)!)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(noneFoundMessage);
      } else {
        return [items, response.hasMore];
      }
    } else {
      this.handleResponseError(response);
    }
  }

  public async getFollowees(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    return this.getMorePagedItems<UserDto, User>(
      request,
      "/follow/get-followees",
      "No followees found",
      (dto: UserDto) => User.fromDto(dto)
    );
  }

  public async getFollowers(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    return this.getMorePagedItems<UserDto, User>(
      request,
      "/follow/get-followers",
      "No followers found",
      (dto: UserDto) => User.fromDto(dto)
    );
  }

  public async follow(
    request: FollowUpdateRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowUpdateRequest,
      FollowUpdateResponse
    >(request, "/follow/follow");

    if (response.success) {
      return [response.followerCount, response.followerCount];
    } else {
      this.handleResponseError(response);
    }
  }

  public async unfollow(
    request: FollowUpdateRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowUpdateRequest,
      FollowUpdateResponse
    >(request, "/follow/follow");

    if (response.success) {
      return [response.followerCount, response.followerCount];
    } else {
      this.handleResponseError(response);
    }
  }

  public async getIsFollower(request: IsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follow/get-is-follower");

    if (response.success) {
      return response.isFollower;
    } else {
      this.handleResponseError(response);
    }
  }

  public async getFolloweeCount(
    request: GetFollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/follow/get-followee-count");

    if (response.success) {
      return response.count;
    } else {
      this.handleResponseError(response);
    }
  }

  public async getFollowerCount(
    request: GetFollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/follow/get-follower-count");

    if (response.success) {
      return response.count;
    } else {
      this.handleResponseError(response);
    }
  }

  public async getStories(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return this.getMorePagedItems<StatusDto, Status>(
      request,
      "/status/get-stories",
      "No stories found",
      (dto: StatusDto) => Status.fromDto(dto)
    );
  }

  public async getFeeds(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return this.getMorePagedItems<StatusDto, Status>(
      request,
      "/status/get-feeds",
      "No feeds found",
      (dto: StatusDto) => Status.fromDto(dto)
    );
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status/post-status");

    if (!response.success) {
      this.handleResponseError(response);
    }
  }

  private handleTokenSuccessResponse(
    response: TokenResponse,
    errorMessage: string
  ): [User, AuthToken] {
    const userDto = response.user;
    const authTokenDto = response.authToken;
    if (authTokenDto === null || userDto === null) {
      throw new Error(errorMessage);
    } else {
      return [User.fromDto(userDto)!, AuthToken.fromDto(authTokenDto)!];
    }
  }

  public async login(request: TokenRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      TokenRequest,
      TokenResponse
    >(request, "/user/login");

    if (response.success) {
      return this.handleTokenSuccessResponse(response, "Incorrect credentials");
    } else {
      this.handleResponseError(response);
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      TokenResponse
    >(request, "/user/register");

    if (response.success) {
      return this.handleTokenSuccessResponse(response, "Invalid registration");
    } else {
      this.handleResponseError(response);
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get-user");

    if (response.success) {
      return User.fromDto(response.user);
    } else {
      this.handleResponseError(response);
    }
  }
}
