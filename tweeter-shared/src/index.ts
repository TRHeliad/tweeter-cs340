// Domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// DTOs
export type { UserDto } from "./model/dto/UserDto";

// Requests
export type { PagedUserItemRequest } from "./model/net/request/PagedUserItemRequest";
export type { FollowUpdateRequest } from "./model/net/request/FollowUpdateRequest";
export type { IsFollowerRequest } from "./model/net/request/IsFollowerRequest";

// Responses
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse";
export type { FollowUpdateResponse } from "./model/net/response/FollowUpdateResponse";
export type { IsFollowerResponse } from "./model/net/response/IsFollowerResponse";

// Other
export { FakeData } from "./util/FakeData";
