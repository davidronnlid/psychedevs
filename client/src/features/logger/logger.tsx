import { useFetchLogTypes } from "../../functions/logTypesHooks";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectLogTypes } from "../../redux/logTypesSlice";
import {
  FetchLogsResponseElement,
  LogType,
} from "../../typeModels/logTypeModel";
import VasForm from "./vas_form/vasForm";
import { hasCollectedLogTypeToday } from "../../functions/hasCollectedLogTypeToday";
import { useEffect, useState } from "react";
import TabPanel from "../../components/tabPanel";
import { AppBar, Tab, Tabs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import VerticalSpacer from "../../components/VerticalSpacer";
import { useJwt } from "../../redux/authSlice";
import ConfirmationMessage from "../../components/alerts/confirmationMessage";
import { useFetchLogsQuery } from "../../redux/logsAPI/logsAPI";
import { useFetchOuraLogsQuery } from "../../redux/ouraAPI/logs/ouraLogsAPI"; // Import for Oura logs
import getTodayDate from "../../functions/getToday";
import useWeekday from "../../functions/useWeekday";
import CollectedLogs from "./collectedLogs";

// Helper function to format the date as YYYY-MM-DD
const formatDate = (date: Date): { start: string; end: string } => {
  const endYear = date.getFullYear();
  const endMonth = String(date.getMonth() + 1).padStart(2, "0");
  const endDay = String(date.getDate()).padStart(2, "0");
  const end = `${endYear}-${endMonth}-${endDay}`;

  const startDate = new Date(date);
  startDate.setDate(date.getDate() - 1);
  const startYear = startDate.getFullYear();
  const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
  const startDay = String(startDate.getDate()).padStart(2, "0");
  const start = `${startYear}-${startMonth}-${startDay}`;

  return { start, end };
};

const Logger = () => {
  // Component state, functions and properties
  const today = getTodayDate();
  const formattedToday = formatDate(today);

  const [tabValue, setTabValue] = useState<number>(0);
  const handleTabsChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [confirmationMessageOpen, setConfirmationMessageOpen] = useState(false);

  // Getting log and log type data state, functions and properties
  const [inProcessOfLoading, err] = useFetchLogTypes();
  const logTypesOfUser: LogType[] = useAppSelector(selectLogTypes);

  const { data: logsOfToday, error: logsOfTodayError } = useFetchLogsQuery({
    startDate: formattedToday.start,
    endDate: formattedToday.end,
    logTypeIds: logTypesOfUser.map(
      (logType: LogType) => logType.logType_id
    ) ?? [""],
  });

  // Fetching Oura Logs for "average_hrv" log type id
  const {
    data: ouraLogsData,
    error: ouraLogsError,
    isLoading: ouraLogsIsLoading,
  } = useFetchOuraLogsQuery({
    logTypeIds: ["average_hrv", "total_sleep_duration"],
    startDate: formattedToday.start,
    endDate: formattedToday.end,
  });

  // Function to be triggered when average_hrv is less than 65
  const handleLowHRV = () => {
    console.log("HRV is less than 65, taking action!");
    // Your custom logic here
  };

  useEffect(() => {
    if (
      ouraLogsData &&
      ouraLogsData["average_hrv"] &&
      ouraLogsData["average_hrv"].length > 0
    ) {
      const averageHRV = ouraLogsData["average_hrv"][0]?.average_hrv;
      if (averageHRV < 75) {
        handleLowHRV();
      }
    }
  }, [ouraLogsData]);

  // Getting the day of the week today for rendering in the UI of the Logger
  let dayOfWeekToday = today.getDay(); // Returns a number between 0 and 6 representing the day of the week

  // These below lines are to set dayOfWeekToday to 0-6 : monday-sunday since today.getDay() starts at 0=sunday
  if (dayOfWeekToday === 0) {
    dayOfWeekToday = 6;
  } else {
    dayOfWeekToday--;
  }

  const weekday = useWeekday(dayOfWeekToday);
  const dateToDisplay = (
    <>
      {" "}
      <u>{weekday}</u>{" "}
      <span style={{ fontSize: "1rem" }}>
        <i>({today.toLocaleDateString()})</i>
      </span>
    </>
  );

  // Below variable is array of all log types that user has planned to collect today AND don't have a collected log today
  const logTypesToCollectToday = logTypesOfUser
    .filter((logType) => logType.weekdays[dayOfWeekToday] === true)
    .filter(
      (logType) =>
        !hasCollectedLogTypeToday(
          logsOfToday,
          logType.logType_id ? logType.logType_id : ""
        )
    );

  // Below variable is array of all log types that user has planned to collect today AND have a collected log today
  const collectedLogtypes = logTypesOfUser.filter((logType) =>
    hasCollectedLogTypeToday(
      logsOfToday,
      logType.logType_id ? logType.logType_id : ""
    )
  );
  console.log(
    "🚀 ~ file: logger.tsx:95 ~ Logger ~ collectedLogtypes:",
    collectedLogtypes
  );

  const [collectedAll, setCollectedAll] = useState(
    logTypesToCollectToday.length === 0 && collectedLogtypes.length > 0
  );

  useEffect(() => {
    setCollectedAll(
      logTypesToCollectToday.length === 0 && collectedLogtypes.length > 0
    );
  }, [logTypesToCollectToday, collectedLogtypes]);

  const getHRVBackgroundColor = (hrv: number) => (hrv >= 66 ? "green" : "red");
  const getSleepBackgroundColor = (sleep: number) =>
    sleep > 7.5 ? "green" : "red";

  return (
    <>
      <div>
        {!collectedAll && (
          <AppBar
            position="fixed"
            sx={{
              backgroundColor: "#001219",
              color: "#7acde9",
              border: "none",
              width: "290px",
              left: 0,
              zIndex: 1100,
              top: "12vw",
              boxShadow:
                "0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 2px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14)",
              "@media (max-width: 480px)": {
                "& *": {
                  fontSize: ".6rem",
                },
              },
            }}
          >
            <Tabs value={tabValue} onChange={handleTabsChange}>
              <Tab
                label="To collect"
                sx={{
                  "&.MuiTab-root": {
                    color: "#26ace2",
                  },
                  "&.Mui-selected": {
                    color: "#7acde9",
                  },
                  "&.MuiTab-root:hover": {
                    color: "#26ace2",
                    opacity: 0.7,
                  },
                }}
              />
              <Tab
                label="collected"
                sx={{
                  "&.MuiTab-root": {
                    color: "#26ace2",
                  },
                  "&.Mui-selected": {
                    color: "#7acde9",
                  },
                  "&.MuiTab-root:hover": {
                    color: "#26ace2",
                    opacity: 0.7,
                  },
                }}
              />
            </Tabs>
          </AppBar>
        )}
        <VerticalSpacer size="1rem" />
        <TabPanel value={tabValue} index={collectedAll ? 1 : 0}>
          <Typography variant="h4" component="h1" gutterBottom>
            Logs <b>to collect</b> today,{dateToDisplay}
          </Typography>
          {inProcessOfLoading && <p>Loading...</p>}
          {err && <p>Error: {err}</p>}
          {logTypesToCollectToday.map((logType: LogType) => (
            <VasForm
              value={3}
              name={logType.name}
              answer_format={logType.answer_format}
              logType_id={logType.logType_id ? logType.logType_id : ""}
              unit={logType.unit}
            />
          ))}
        </TabPanel>
        {collectedAll && (
          <div
            style={{
              backgroundColor: "#4caf50",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              style={{ color: "#fff" }}
            >
              Good job! You collected all planned log types for today.
            </Typography>
            <Typography
              variant="body1"
              style={{ color: "#fff", marginTop: "0.5rem" }}
            >
              Suggested next steps:{" "}
              <Link to="/logs/analyzer" style={{ color: "#fff" }}>
                Analyze
              </Link>{" "}
              your past logs or{" "}
              <Link to="/logs/planner" style={{ color: "#fff" }}>
                plan
              </Link>{" "}
              what log types to log in the future.
            </Typography>
          </div>
        )}
        <TabPanel value={tabValue} index={collectedAll ? 0 : 1}>
          <CollectedLogs
            dateToDisplay={dateToDisplay}
            collectedLogTypes={collectedLogtypes}
            logsOfToday={logsOfToday}
          />
          <Typography variant="h4" component="p" mt={3}>
            Oura sleep data for today
          </Typography>
          {ouraLogsData && ouraLogsData["average_hrv"] && (
            <Typography
              variant="h6"
              component="p"
              gutterBottom
              style={{
                backgroundColor: getHRVBackgroundColor(
                  ouraLogsData["average_hrv"][0]?.average_hrv
                ),
                color: "#fff",
                padding: "0.5rem",
                borderRadius: "0.25rem",
              }}
            >
              HRV: {ouraLogsData["average_hrv"][0]?.average_hrv}
            </Typography>
          )}

          {ouraLogsData && ouraLogsData["total_sleep_duration"] && (
            <Typography
              variant="h6"
              component="p"
              gutterBottom
              style={{
                backgroundColor: getSleepBackgroundColor(
                  ouraLogsData["total_sleep_duration"][0]?.total_sleep_duration
                ),
                color: "#fff",
                padding: "0.5rem",
                borderRadius: "0.25rem",
              }}
            >
              Total sleep:{" "}
              {roundToTwo(
                ouraLogsData["total_sleep_duration"][0]?.total_sleep_duration
              )}
            </Typography>
          )}
        </TabPanel>
      </div>
      <ConfirmationMessage
        message="Success! Your new logs for today were saved."
        state={confirmationMessageOpen}
        stateSetter={setConfirmationMessageOpen}
      />
      {/* <WarningMessage
        message="Please enter an allowed value for the answer format of the log type you are editing."
        state={warningMessageOpen}
        stateSetter={setWarningMessageOpen}
      />
      <InfoMessage
        message="Please enter an allowed value for the answer format of the log type you are editing."
        state={infoMessageOpen}
        stateSetter={setInfoMessageOpen}
      /> */}
    </>
  );
};

export default Logger;

function roundToTwo(num: number) {
  return Math.round(num * 100) / 100;
}
