import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import LogsPage from "./features/vas_logs/vasLogs";

const RDRRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/logs" element={<LogsPage />} />
    </Routes>
  );
};

export default RDRRoutes;
