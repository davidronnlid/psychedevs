import { useFetchLogTypes } from "../../functions/logTypesHooks";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import EditIcon from "@mui/icons-material/Edit";
import { selectLogTypes } from "../../redux/logTypesSlice";
import {
  FetchLogsResponseElement,
  LogType,
} from "../../typeModels/logTypeModel";
import VasForm from "./vas_form/vasForm";
import { hasCollectedLogTypeToday } from "../../functions/hasCollectedLogTypeToday";
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
import { Button } from "@mui/material";
import { useJwt } from "../../redux/authSlice";
import ConfirmationMessage from "../../components/alerts/confirmationMessage";
import { useFetchLogsQuery } from "../../redux/logsAPI/logsAPI";
import getTodayDate from "../../functions/getToday";
import useWeekday from "../../functions/useWeekday";

const Logger = () => {
  const token = useJwt();

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

  // Update log values state, functions and properties below
  const [editable, setEditable] = useState(false);
  const [updatedLogs, setUpdatedLogs] = useState<FetchLogsResponseElement[]>(
    []
  );
  const handleStartEditing = () => {
    setEditable(true);
  };

  const handleSaveUpdatedLogs = async () => {
    setEditable(false);
    console.log("updatedLogs ", updatedLogs);

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
    setUpdatedLogs([]);
  };
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
          <Typography variant="h4" component="h1" gutterBottom>
            Logs <b>collected</b> today, {dateToDisplay}
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
                {collectedLogtypes.map((logType: LogType) => {
                  const fetchLogsResponseElementOfLogTypeCollectedToday =
                    logsOfToday?.find(
                      (fetchLogsResponseElement) =>
                        fetchLogsResponseElement.logs[0].logType_id ===
                        logType.logType_id
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
                            const editingLogOfLogTypeId =
                              fetchLogsResponseElementOfLogTypeCollectedToday
                                ?._id.logType_id;

                            // Check if the value is within the allowed range based on the answer_format
                            const isValueWithinRange =
                              (logType.answer_format === "1-5 scale" &&
                                updatedValue >= 1 &&
                                updatedValue <= 5) ||
                              (logType.answer_format === "1-10 scale" &&
                                updatedValue >= 1 &&
                                updatedValue <= 10);

                            if (
                              editingLogOfLogTypeId &&
                              fetchLogsResponseElementOfLogTypeCollectedToday
                                ?.logs[0].value !== updatedValue &&
                              !isNaN(updatedValue)
                            ) {
                              if (isValueWithinRange) {
                                let updatedLog: FetchLogsResponseElement = {
                                  ...fetchLogsResponseElementOfLogTypeCollectedToday,
                                  logs: fetchLogsResponseElementOfLogTypeCollectedToday.logs.map(
                                    (log) => ({ ...log, value: updatedValue })
                                  ),
                                };
                                console.log(
                                  "🚀 ~ file: logger.tsx:345 ~ {collectedLogtypes.map ~ updatedLog:",
                                  updatedLog
                                );

                                setUpdatedLogs([...updatedLogs, updatedLog]);
                              } else {
                                // Reset the input value to the original log value if it's not within the allowed range
                                e.target.textContent =
                                  fetchLogsResponseElementOfLogTypeCollectedToday
                                    ?.logs[0].value !== undefined
                                    ? fetchLogsResponseElementOfLogTypeCollectedToday.logs[0].value.toString()
                                    : "";
                              }
                            }
                          }}
                        >
                          {
                            fetchLogsResponseElementOfLogTypeCollectedToday
                              ?.logs[0].value
                          }
                        </TableCell>
                      ) : (
                        <TableCell>
                          {
                            fetchLogsResponseElementOfLogTypeCollectedToday
                              ?.logs[0].value
                          }
                        </TableCell>
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
