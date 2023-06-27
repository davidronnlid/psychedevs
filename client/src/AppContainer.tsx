import React, { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./redux/hooks";
import { setAuthState } from "./redux/authSlice";
import App from "./App";
import UserProfile from "./features/users/userProfile";
import Hamburger from "./components/hamburger";
import PDHeaderLogo from "./images/PDHeaderLogo.png";
import "./styles/app.scss";
import ProfileMenu from "./components/profileMenu/profileMenu";
import PlanLogs from "./features/planner/plannerPage";
import LogsAnalyzerPage from "./features/analyzer/logsAnalyzerPage";
import useGetUser from "./functions/useGetUser";

const AppContainer: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const user: any = useGetUser();
  console.log("🚀 ~ file: AppContainer.tsx:18 ~ user:", user);
  if (user) {
    localStorage.setItem("user_sesh_JWT", user.token);
  }
  console.log(user);

  useEffect(() => {
    const jwt = localStorage.getItem("user_sesh_JWT");
    dispatch(setAuthState({ isAuthenticated: true, jwt }));
  }, [user]);

  return (
    <div className="appContainer">
      <header>
        <Link to="/">
          <img
            className="header-logo"
            src={PDHeaderLogo}
            alt="PsycheDevs header logo"
          />
        </Link>
        <div className="headerRightSection">
          <ProfileMenu />
          <Hamburger />
        </div>
      </header>
      <div className="nonHeaderContentContainer">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/logs/analyzer" element={<LogsAnalyzerPage />} />
          <Route path="/logs/planner" element={<PlanLogs />} />
          <Route path="/user-profile/:userId" element={<UserProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppContainer;
