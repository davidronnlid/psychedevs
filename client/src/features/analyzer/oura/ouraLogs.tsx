import { selectOuraLogsData } from "../../../redux/ouraAPI/logs/ouraLogsSlice";
import { useAppSelector } from "../../../redux/hooks";
// import DailyActivityTable from "./ouraCategories/DailyActivityTable";
// import SleepDataTable from "./ouraCategories/sleep/SleepDataTable";
// import SleepDataGraph from "./ouraCategories/sleep/SleepDataGraph";
import { Typography } from "@mui/material";

const OuraLogs = () => {
  const ouraData = useAppSelector(selectOuraLogsData);

  console.log("🚀 ~ file: ouraLogs.tsx:6 ~ useEffect ~ ouraData:", ouraData);

  return (
    <div>
      <Typography variant="h4">Oura logs</Typography>
      {/* {ouraData.sleep && (
        <>
          <SleepDataGraph sleepData={ouraData.sleep.data} />
          <SleepDataTable sleepData={ouraData.sleep.data} />
        </>
      )}
      {ouraData.daily_activity && (
        <DailyActivityTable dailyActivities={ouraData.daily_activity.data} />
      )} */}
    </div>
  );
};

export default OuraLogs;
