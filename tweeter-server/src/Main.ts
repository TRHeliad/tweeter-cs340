import { handler } from "./lambda/follow/GetFollowersLambda";

handler({
  token: "e3d87817-cf98-4f85-abbe-908c207dc556",
  userAlias: "@ben",
  pageSize: 10,
  lastItem: undefined,
}).then((response) => {
  console.log(response);
});
