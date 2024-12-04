import { handler } from "./lambda/status/GetFeedsLambda";

handler({
  token: "0732f980-21a5-4db1-9443-81daabcf5da5",
  userAlias: "@jeff",
  pageSize: 10,
  lastItem: undefined,
}).then((response) => {
  console.log(response);
});
