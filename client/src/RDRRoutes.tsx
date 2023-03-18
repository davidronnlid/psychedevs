import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import BackButton from "./components/backButton";
import UserProfile from "./features/users/userProfile";
import LogsPage from "./features/vas_logs/vasLogs";

const RDRRoutes: React.FC = () => {
  return (
    <>
      <BackButton />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/logs" element={<LogsPage MoodLogList={[]} />} />
        <Route path="/user-profile/:userId" element={<UserProfile />} />
      </Routes>
    </>
  );
};

export default RDRRoutes;
