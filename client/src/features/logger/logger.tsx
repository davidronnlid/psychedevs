import { useFetchLogTypes } from "../../functions/logTypesHooks";
import { useAppSelector } from "../../redux/hooks";
import { useFetchLogsQuery } from "../../redux/logsAPI/logsAPI";
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
import ConfirmationMessage from "../../components/confirmationMessage";
import { Link } from "react-router-dom";

const Logger = () => {
  const [tabValue, setTabValue] = useState(0);

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
  const { data, error, isLoading } = useFetchLogsQuery();

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
    .filter((logType) => !hasLogTypeToday(data, logType.logType_id))
    .filter((logType) => logType.weekdays[dayOfWeek] === true);

  console.log("filteredLogTypesData ", dayOfWeek, filteredLogTypesData); // will log an array of logType objects with true for the current dayOfWeek

  const completedLogtypes = logTypesData.filter((logType) =>
    hasLogTypeToday(data, logType.logType_id)
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
    <div>
      {!completedAll && (
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#001219",
            color: "#7acde9",
            border: "none",
            width: "300px",
            margin: "-0.5rem auto 5rem auto",
            boxShadow:
              "0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 2px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14)",
            borderRadius: "0.5rem",
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
                  <b>Log Type Name</b>
                </TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {completedLogtypes.map((logType: LogType) => {
                const log = data?.find(
                  (log) => log.logType_id === logType.logType_id
                );
                return (
                  <TableRow key={logType.logType_id}>
                    <TableCell>
                      {logType.name} <i>({logType.answer_format})</i>
                    </TableCell>
                    <TableCell>{log?.value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </div>
  );
};

export default Logger;
