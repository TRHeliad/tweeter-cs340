import { handler } from "./lambda/follow/UnfollowLambda";

handler({
  token: "0732f980-21a5-4db1-9443-81daabcf5da5",
  user: {
    alias: "@ben",
    firstName: "",
    lastName: "",
    imageUrl: "",
  },
}).then((response) => {
  console.log(response);
});
