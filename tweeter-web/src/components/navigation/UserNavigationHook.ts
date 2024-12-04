import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenters/UserNavigationPresenter";
import { useState } from "react";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigation = (): UserNavigation => {
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const listener: UserNavigationView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
  };

  const [presenter] = useState(new UserNavigationPresenter(listener));

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  return {
    navigateToUser: async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();
      const alias = extractAlias(event.target.toString());
      presenter.navigateToUser(alias, currentUser!, authToken!);
    },
  };
};

export default useUserNavigation;
