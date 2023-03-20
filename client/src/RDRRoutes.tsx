import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setAuthState } from "./redux/authSlice";
import App from "./App";
import BackButton from "./components/backButton";
import UserProfile from "./features/users/userProfile";
import LogsPage from "./features/vas_logs/vasLogs";
import Hamburger from "./components/hamburger";
import { selectUser } from "./redux/userSlice";

const RDRRoutes: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("user_sesh_JWT");
    if (jwt) {
      dispatch(setAuthState({ isAuthenticated: true, jwt }));
    }
  }, [dispatch]);

  const logOut = () => {
    try {
      dispatch(setAuthState({ isAuthenticated: false, jwt: null }));

      //Set hamburger openState here? Nah bro, but work on this
    } catch (error) {
      console.error(error);
    }

    console.log("registered log out click");
    localStorage.setItem("user_sesh_JWT", "");
  };

  const user = useAppSelector(selectUser);

  return (
    <>
      <BackButton />
      <Hamburger logOutFunc={logOut} user={user} />

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/logs" element={<LogsPage MoodLogList={[]} />} />
        <Route path="/user-profile/:userId" element={<UserProfile />} />
      </Routes>
    </>
  );
};

export default RDRRoutes;
