import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { UserItemView } from "./presenters/UserItemPresenter";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { StatusItemView } from "./presenters/StatusItemPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <StatusItemScroller 
              presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
            />
          }
        />
        <Route
          path="story"
          element={
            <StatusItemScroller 
              presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
            />
          }
        />
        <Route
          path="followees"
          element={
            <UserItemScroller
              key={1}
              presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
              key={2} 
              presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
