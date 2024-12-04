import { handler } from "./lambda/status/GetStoriesLambda";

handler({
  token: "ff9c00f1-657b-427c-80b2-f15d3559f36b",
  userAlias: "ben",
  pageSize: 10,
  lastItem: undefined,
}).then((response) => {
  console.log(response);
});
