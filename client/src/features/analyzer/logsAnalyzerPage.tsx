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
import InfoModal from "../../components/InfoModal";
import AllLogsGraph from "./AllLogsGraph";

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
  const [inProcessOfLoading, err] = useFetchLogTypes();
  const logTypes = useAppSelector(selectLogTypes);

  const logsData = useAppSelector(selectLogs);
  const groupedLogs = groupLogsByLogTypeId(logsData || []);

  const [selectedLogTypeName, setSelectedLogTypeName] = useState("");
  const [selectedLogTypeNameTwo, setSelectedLogTypeNameTwo] = useState("");
  const [correlationData, setCorrelationData] = useState<{
    correlation: number | null;
    pValue: number | null;
    requiredSampleSize?: number | null;
    existingSampleSize?: number | null;
  }>({
    correlation: null,
    pValue: null,
    requiredSampleSize: null,
    existingSampleSize: null,
  });

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
      setCorrelationData(calculateCorrelation(filteredLogs));
    }
  }, [
    selectedLogTypeName,
    selectedLogTypeNameTwo,
    groupedLogs,
    inProcessOfLoading,
  ]);

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
      <AllLogsGraph />

      {groupedLogs
        ? Object.entries(groupedLogs).map(([logTypeId, logs]) => (
            <LogsOfALogType
              key={logTypeId}
              logType_id={logTypeId}
              logList={logs}
              name={findMatchingName(logTypeId)}
            />
          ))
        : "Loading..."}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "20%",
          justifyContent: "space-between",
        }}
      >
        <h3>Find correlations</h3>
        <InfoModal
          title="Correlation and required sample size equations"
          bodyText="Equation used to calculate correlation:
        Pearsons R = (nΣ(xy) - ΣxΣy) /
        sqrt([nΣ(x^2) - (Σx)^2] * [nΣ(y^2) - (Σy)^2]).
        
        Equation used to calculate required sample size:
        n = ((z_alpha + z_beta) / r)^2 where n is the required sample size, z_alpha and z_beta are the z-scores associated with the desired significance levels, and r is the correlation coefficient."
        />
      </div>
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
      </FormControl>
      <br />
      <FormControl>
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
      {correlationData &&
        selectedLogTypeName !== "" &&
        selectedLogTypeNameTwo !== "" &&
        ((correlationData?.existingSampleSize ?? 0) >=
          (correlationData?.requiredSampleSize ?? 1100) &&
        (correlationData?.pValue ?? 1) <= 0.05 ? (
          <>
            <p>YOOOO correlation bro</p>
            <p>Correlation: {correlationData.correlation}</p>
            <p>P-value: {correlationData.pValue}</p>
          </>
        ) : (
          <>
            <h3>No correlation was found. </h3>
            {(correlationData?.existingSampleSize ?? 0) <=
            (correlationData?.requiredSampleSize ?? 0) ? (
              <>
                <h4>
                  You need to collect more logs for these log types to find
                  possible correlations between them.{" "}
                </h4>
                <p>
                  Existing logs per log type:{" "}
                  {correlationData.existingSampleSize}
                </p>
                <p>
                  Estimated required logs per log type:{" "}
                  {correlationData.requiredSampleSize}
                </p>
              </>
            ) : (
              <h4>One of these log types has no logs.</h4>
            )}
          </>
        ))}

      <Box padding="100px" />
    </>
  );
};

export default LogsAnalyzerPage;
