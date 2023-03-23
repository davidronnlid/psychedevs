import React, { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./redux/hooks";
import { setAuthState } from "./redux/authSlice";
import App from "./App";
import BackButton from "./components/backButton";
import UserProfile from "./features/users/userProfile";
import LogsPage from "./features/vas_logs/vasLogs";
import Hamburger from "./components/hamburger";
import PDHeaderLogo from "./images/PDHeaderLogo.png";
import "./styles/app.scss";
import ProfileMenu from "./components/profileMenu";
import { fetchUserProfile } from "./functions/fetchUserProfile";
import { setUserState } from "./redux/userSlice";

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
          <img src={PDHeaderLogo} style={{ width: "50vw" }} />
        </Link>
      </header>
      <BackButton />

      <div className="headerRightSection">
        <ProfileMenu />
        <Hamburger />
      </div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/logs" element={<LogsPage MoodLogList={[]} />} />
        <Route path="/user-profile/:userId" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default AppContainer;
