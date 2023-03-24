import React from "react";

const logTypes = [
  "Mood",
  "Energy",
  "Sleep",
  "Diet",
  "Exercise",
  "Productivity",
  "Stress",
];

const PlanLogs: React.FC = () => {
  return (
    <div>
      <h1>Plan what to log and when to log</h1>
      <h2>Current log types:</h2>
      <ul>
        {logTypes.map((logType) => (
          <li key={logType}>{logType}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlanLogs;
