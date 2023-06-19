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
import getTodayDate from "../../functions/getToday";
import useWeekday from "../../functions/useWeekday";
import CollectedLogs from "./collectedLogs";

const Logger = () => {
  // Component state, functions and properties
  const today = getTodayDate();

  const [tabValue, setTabValue] = useState<number>(0);
  const handleTabsChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [confirmationMessageOpen, setConfirmationMessageOpen] = useState(false);

  // Getting log and log type data state, functions and properties
  const [inProcessOfLoading, err] = useFetchLogTypes();
  const logTypesOfUser: LogType[] = useAppSelector(selectLogTypes);

  const { data: logsOfToday, error: logsOfTodayError } = useFetchLogsQuery({
    startDate: today.toString(),
    endDate: today.toString(),
    logTypeIds: logTypesOfUser.map(
      (logType: LogType) => logType.logType_id
    ) ?? [""],
  });

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
        <VerticalSpacer size="3rem" />
        <TabPanel value={tabValue} index={collectedAll ? 1 : 0}>
          <Typography variant="h4" component="h1" gutterBottom>
            Logs <b>to collect</b> for today,{dateToDisplay}
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
