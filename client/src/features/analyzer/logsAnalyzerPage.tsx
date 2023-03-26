import { useFetchLogTypes } from "../../functions/logTypesHooks";
import { useAppSelector } from "../../redux/hooks";
import { useFetchLogsQuery } from "../../redux/logsAPI/logsAPI";
import { selectLogTypes } from "../../redux/logTypesSlice";
import { Log } from "../../typeModels/logTypeModel";
import LogsOfALogType from "./vas_logs/logsOfALogType";

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
  const { data, error, isLoading } = useFetchLogsQuery();
  const groupedLogs = groupLogsByLogTypeId(data || []);
  const [inProcessOfLoading, err] = useFetchLogTypes();
  const logTypes = useAppSelector(selectLogTypes);

  const findMatchingName = (logTypeId: string): string => {
    const logType = logTypes.find((lt) => lt.logType_id === logTypeId);
    return logType ? logType.name : "Unknown";
  };

  if (inProcessOfLoading) return <div>Loading...</div>;
  if (err) return <div>Error: {err}</div>;

  console.log(Object.entries(groupedLogs));

  return (
    <>
      <div>
        <h2>Logs</h2>
        {Object.entries(groupedLogs).map(([logTypeId, logs]) => (
          <LogsOfALogType
            key={logTypeId}
            logType_id={logTypeId}
            logList={logs}
            name={findMatchingName(logTypeId)}
          />
        ))}
      </div>
    </>
  );
};

export default LogsAnalyzerPage;
