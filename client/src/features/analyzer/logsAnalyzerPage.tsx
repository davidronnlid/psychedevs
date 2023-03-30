import { useFetchLogTypes } from "../../functions/logTypesHooks";
import { useAppSelector } from "../../redux/hooks";
import { selectLogTypes } from "../../redux/logTypesSlice";
import { Log, LogType } from "../../typeModels/logTypeModel";
import LogsOfALogType from "./vas_logs/logsOfALogType";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { calculateCorrelation } from "../../functions/correlations";
import VerticalSpacer from "../../components/VerticalSpacer";
import { selectLogs } from "../../redux/logsAPI/logsSlice";
// import { calculateCorrelation } from "../../functions/correlations";

function groupLogsByLogTypeId(logs: Log[]): Record<string, Log[]> {
  return logs.reduce((acc: Record<string, Log[]>, log: Log) => {
    if (acc[log.logType_id]) {
      acc[log.logType_id].push(log);
    } else {
      acc[log.logType_id] = [log];
    }
    return acc;
  }, {});
}

const LogsAnalyzerPage = () => {
  const data = useAppSelector(selectLogs);

  const groupedLogs = groupLogsByLogTypeId(data || []);
  const [inProcessOfLoading, err] = useFetchLogTypes();
  const logTypes = useAppSelector(selectLogTypes);

  const [selectedLogTypeName, setSelectedLogTypeName] = useState("");
  const [selectedLogTypeNameTwo, setSelectedLogTypeNameTwo] = useState("");
  const [correlation, setCorrelation] = useState<number>(0);

  useEffect(() => {
    const selectedLogTypeIds = findMatchingLogTypeIds(
      selectedLogTypeName,
      selectedLogTypeNameTwo
    );

    // Filter Object.entries(groupedLogs) by user-selected log types
    const filteredLogs = Object.entries(groupedLogs)
      .filter(([logTypeId, logs]) => selectedLogTypeIds.includes(logTypeId))
      .map(([logTypeId, logs]) => logs);

    console.log("filteredLogs ", filteredLogs);
    if (filteredLogs.length > 1) {
      const correlation = calculateCorrelation(filteredLogs);
      setCorrelation(correlation);
    }
  }, [selectedLogTypeName, selectedLogTypeNameTwo]);

  const findMatchingName = (logTypeId: string): string => {
    const logType = logTypes.find((lt) => lt.logType_id === logTypeId);
    return logType ? logType.name : "Unknown";
  };

  const findMatchingLogTypeIds = (
    name1: string,
    name2: string
  ): [string | undefined, string | undefined] => {
    const logType1 = logTypes.find((lt: LogType) => lt.name === name1);
    const logType2 = logTypes.find((lt: LogType) => lt.name === name2);

    const logTypeId1 = logType1 ? logType1.logType_id : "Unknown";
    const logTypeId2 = logType2 ? logType2.logType_id : "Unknown";

    return [logTypeId1, logTypeId2];
  };

  if (inProcessOfLoading) return <div>Loading...</div>;
  if (err) return <div>Error: {err}</div>;

  console.log(Object.entries(groupedLogs));

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedLogTypeName(event.target.value);
  };

  const handleChangeTwo = (event: SelectChangeEvent<string>) => {
    setSelectedLogTypeNameTwo(event.target.value);
  };

  return (
    <>
      <VerticalSpacer size="3rem" />

      <Typography variant="h4" gutterBottom>
        Logs
      </Typography>
      {Object.entries(groupedLogs).map(([logTypeId, logs]) => (
        <LogsOfALogType
          key={logTypeId}
          logType_id={logTypeId}
          logList={logs}
          name={findMatchingName(logTypeId)}
        />
      ))}
      <h3>Find correlations</h3>
      <p>Please select two log types to analyze</p>
      <FormControl>
        <Select
          labelId="select-log-type-label"
          id="select-log-type"
          value={selectedLogTypeName}
          onChange={handleChange}
          inputProps={{ "aria-label": "select log type" }}
        >
          {logTypes.map((logType) => (
            <MenuItem key={logType.logType_id} value={logType.name}>
              {logType.name}
            </MenuItem>
          ))}
        </Select>
        <br />
        <Select
          labelId="select-log-type-label-two"
          id="select-log-type-two"
          value={selectedLogTypeNameTwo}
          onChange={handleChangeTwo}
          inputProps={{ "aria-label": "select log type" }}
        >
          {logTypes.map((logType) => (
            <MenuItem key={logType.logType_id} value={logType.name}>
              {logType.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <p>{correlation}</p>
      <Box padding="100px" />
    </>
  );
};

export default LogsAnalyzerPage;
