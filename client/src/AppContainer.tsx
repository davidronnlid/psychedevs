import React, { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./redux/hooks";
import { setAuthState } from "./redux/authSlice";
import App from "./App";
import UserProfile from "./features/users/userProfile";
import Hamburger from "./components/hamburger";
import PDHeaderLogo from "./images/PDHeaderLogo.png";
import "./styles/app.scss";
import ProfileMenu from "./components/profile/profileMenu";
import { fetchUserProfile } from "./functions/fetchUserProfile";
import { setUserState } from "./redux/userSlice";
import SignUpPage from "./features/signupAndLoginForms/signUpPage";
import LoginPage from "./features/signupAndLoginForms/loginPage";
import PlanLogs from "./features/planner/plannerPage";
import LogsAnalyzerPage from "./features/analyzer/logsAnalyzerPage";

const AppContainer: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("user_sesh_JWT");
    if (jwt) {
      dispatch(setAuthState({ isAuthenticated: true, jwt }));

      // req to users/user-id is logged, but not req to users/user-profile, the below function doesn't see to get called

      const fetchData = async () => {
        // Call function that gets user from server from db
        const result = await fetchUserProfile(jwt);
        const user = result.data;
        console.log(result);

        // ask AI why it logs "not valid json" and also try to understand why it doesnt send a req at all as observed in server !logs

        if (user) {
          dispatch(
            setUserState({
              _id: user._id,
              username: user.username,
              profile_pic_filename: user?.profile_pic_filename,
            })
          );
        }
      };

      fetchData();
    }
  }, [dispatch]);

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
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logs/analyzer" element={<LogsAnalyzerPage />} />
          <Route path="/logs/planner" element={<PlanLogs />} />
          <Route path="/user-profile/:userId" element={<UserProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppContainer;
