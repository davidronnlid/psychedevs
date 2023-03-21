import React, { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setAuthState } from "./redux/authSlice";
import App from "./App";
import BackButton from "./components/backButton";
import UserProfile from "./features/users/userProfile";
import LogsPage from "./features/vas_logs/vasLogs";
import Hamburger from "./components/hamburger";
import PDHeaderLogo from "./images/PDHeaderLogo.png";
import "./styles/app.scss";
import ProfileMenu from "./components/profileMenu";

const AppContainer: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("user_sesh_JWT");
    if (jwt) {
      dispatch(setAuthState({ isAuthenticated: true, jwt }));
    }
  }, [dispatch]);

  return (
    <div className="appContainer">
      <header>
        <Link to="/">
          <img src={PDHeaderLogo} style={{ width: "50vw" }} />
        </Link>
        <ProfileMenu />
      </header>
      <BackButton />
      <Hamburger />

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/logs" element={<LogsPage MoodLogList={[]} />} />
        <Route path="/user-profile/:userId" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default AppContainer;
