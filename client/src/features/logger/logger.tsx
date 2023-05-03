import { useFetchLogTypes } from "../../functions/logTypesHooks";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import EditIcon from "@mui/icons-material/Edit";
import { selectLogTypes } from "../../redux/logTypesSlice";
import { LogType } from "../../typeModels/logTypeModel";
import VasForm from "./vas_form/vasForm";
import { hasLogTypeToday } from "../../functions/hasLogTypeToday";
import { useEffect, useState } from "react";
import TabPanel from "../../components/tabPanel";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import VerticalSpacer from "../../components/VerticalSpacer";
import { selectLogs, updateLog } from "../../redux/logsAPI/logsSlice";
import { Button } from "@mui/material";
import { useJwt } from "../../redux/authSlice";
import ConfirmationMessage from "../../components/alerts/confirmationMessage";

const Logger = () => {
  const [editable, setEditable] = useState(false);

  const dispatch = useAppDispatch();
  const [confirmationMessageOpen, setConfirmationMessageOpen] = useState(false);

  const [tabValue, setTabValue] = useState<number>(0);
  const [updatedLogsIds, setUpdatedLogsIds] = useState<string[]>([]);

  const token = useJwt();
  const handleStartEditing = () => {
    setEditable(true);
  };

  const handleSaveUpdatedLogs = async () => {
    setEditable(false);
    const updatedLogs = logs.filter((log) => updatedLogsIds.includes(log._id));
    console.log(
      "🚀 ~ file: logger.tsx:53 ~ handleSaveUpdatedLogs ~ updatedLogs:",
      updatedLogs
    );

    // Dispatch updateLog action for each updated log
    updatedLogs.forEach((log) => {
      dispatch(updateLog(log));
    });

    // Send PUT request to server to update the logs in the database
    try {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;

      const response = await fetch(`${baseUrl}/vas/logs`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token, // Assuming you have the token
        },
        body: JSON.stringify(updatedLogs),
      });

      if (!response.ok) {
        throw new Error("Failed to update logs");
      }

      if (response.ok) {
        setConfirmationMessageOpen(true);
      }
    } catch (error) {
      console.error("Error updating logs:", error);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getToday: () => Date = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const today = getToday();

  const [inProcessOfLoading, err] = useFetchLogTypes();
  const logs = useAppSelector(selectLogs);

  const logTypesData = useAppSelector(selectLogTypes);
  console.log("logTypesData ", logTypesData);

  const thisDate = new Date();
  let dayOfWeek = thisDate.getDay(); // Returns a number between 0 and 6 representing the day of the week

  // These below lines are to set dayOfWeek to 0-6 : monday-sunday since today.getDay() starts at 0=sunday
  if (dayOfWeek === 0) {
    dayOfWeek = 6;
  } else {
    dayOfWeek--;
  }

  function getWeekday(dayOfWeek: number): string {
    const weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return weekdays[dayOfWeek];
  }

  const weekday = getWeekday(dayOfWeek);

  const dateToDisplay = (
    <>
      {" "}
      <u>{weekday}</u>{" "}
      <span style={{ fontSize: "1rem" }}>
        <i>({today.toLocaleDateString()})</i>
      </span>
    </>
  );

  const filteredLogTypesData = logTypesData
    .filter(
      (logType) =>
        !hasLogTypeToday(logs, logType.logType_id ? logType.logType_id : "")
    )
    .filter((logType) => logType.weekdays[dayOfWeek] === true);

  console.log("filteredLogTypesData ", dayOfWeek, filteredLogTypesData); // will log an array of logType objects with true for the current dayOfWeek

  const completedLogtypes = logTypesData.filter((logType) =>
    hasLogTypeToday(logs, logType.logType_id ? logType.logType_id : "")
  );

  console.log(
    "🚀 ~ file: logger.tsx:35 ~ Logger ~ completedLogs:",
    completedLogtypes
  );
  const [completedAll, setCompletedAll] = useState(
    filteredLogTypesData.length === 0 && completedLogtypes.length > 0
  );

  useEffect(() => {
    setCompletedAll(
      filteredLogTypesData.length === 0 && completedLogtypes.length > 0
    );
  }, [filteredLogTypesData, completedLogtypes]);

  return (
    <>
      <div>
        {!completedAll && (
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
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab
                label="To complete"
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
                label="Completed"
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
        <TabPanel value={tabValue} index={completedAll ? 1 : 0}>
          <Typography variant="h4" component="h1" gutterBottom>
            Logs <b>to complete</b> for today,{dateToDisplay}
          </Typography>
          {inProcessOfLoading && <p>Loading...</p>}
          {err && <p>Error: {err}</p>}
          {filteredLogTypesData.map((logType: LogType) => (
            <VasForm
              value={3}
              name={logType.name}
              answer_format={logType.answer_format}
              logType_id={logType.logType_id ? logType.logType_id : ""}
            />
          ))}
        </TabPanel>
        {completedAll && (
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
              Good job! You completed all planned log types for today.
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
        <TabPanel value={tabValue} index={completedAll ? 0 : 1}>
          <Typography variant="h4" component="h1" gutterBottom>
            <b>Completed</b> logs for today, {dateToDisplay}
          </Typography>
          <TableContainer component={Paper} sx={{}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Log Type Names</b>
                  </TableCell>
                  {editable ? (
                    <>
                      Editing values |{" "}
                      <Button
                        color="primary"
                        size="small"
                        onClick={handleSaveUpdatedLogs}
                      >
                        Save
                      </Button>
                      |
                      <Button
                        color="primary"
                        size="small"
                        onClick={() => setEditable(false)}
                      >
                        {" "}
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <p>
                      Values |{" "}
                      <EditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={handleStartEditing}
                      />
                    </p>
                  )}{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {completedLogtypes.map((logType: LogType) => {
                  const log = logs?.find(
                    (log) => log.logType_id === logType.logType_id
                  );
                  return (
                    <TableRow key={logType.logType_id}>
                      <TableCell>
                        {logType.name} <i>({logType.answer_format})</i>
                      </TableCell>
                      {editable ? (
                        <TableCell
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const updatedValue = parseFloat(
                              e.target.textContent ?? ""
                            );
                            const logId = log?._id;

                            // Check if the value is within the allowed range based on the answer_format
                            const isValueWithinRange =
                              (logType.answer_format === "1-5 scale" &&
                                updatedValue >= 1 &&
                                updatedValue <= 5) ||
                              (logType.answer_format === "1-10 scale" &&
                                updatedValue >= 1 &&
                                updatedValue <= 10);

                            if (
                              logId &&
                              log?.value !== updatedValue &&
                              !isNaN(updatedValue)
                            ) {
                              if (isValueWithinRange) {
                                const updatedLog = {
                                  ...log,
                                  value: updatedValue,
                                };

                                // Dispatch the action to update the log in the Redux store
                                dispatch(updateLog(updatedLog));

                                if (!updatedLogsIds.includes(logId)) {
                                  setUpdatedLogsIds([...updatedLogsIds, logId]);
                                }
                              } else {
                                // Reset the input value to the original log value if it's not within the allowed range
                                e.target.textContent =
                                  log?.value !== undefined
                                    ? log.value.toString()
                                    : "";
                              }
                            }
                          }}
                        >
                          {log?.value}
                        </TableCell>
                      ) : (
                        <TableCell>{log?.value}</TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
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
