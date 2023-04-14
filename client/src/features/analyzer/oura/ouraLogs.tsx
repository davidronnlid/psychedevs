import { selectOuraData } from "../../../redux/ouraLogTypesAPI/ouraLogTypesSlice";
import { useAppSelector } from "../../../redux/hooks";
import DailyActivityTable from "./ouraCategories/DailyActivityTable";
import { Typography } from "@mui/material";
import SleepDataTable from "./ouraCategories/SleepDataTable";

const OuraLogs = () => {
  const ouraData = useAppSelector(selectOuraData);

  console.log("🚀 ~ file: ouraLogs.tsx:6 ~ useEffect ~ ouraData:", ouraData);

  return (
    <div>
      <Typography variant="h4">Oura logs</Typography>
      {ouraData.daily_activity && (
        <DailyActivityTable dailyActivities={ouraData.daily_activity.data} />
      )}
      {ouraData.sleep && <SleepDataTable sleepData={ouraData.sleep.data} />}
    </div>
  );
};

export default OuraLogs;
